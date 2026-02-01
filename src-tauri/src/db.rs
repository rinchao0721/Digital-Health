use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
use crate::icons;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DashboardData {
    pub total_time: String,
    pub unlocks: i32,
    pub notifications: i32,
    pub score: i32,
    pub trend: Vec<i32>,
    pub segments: Vec<Segment>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Segment {
    pub name: String,
    pub color: String,
    pub percent: i32,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AppUsage {
    pub name: String,
    pub time: String,
    pub icon: String,
    pub color: String, // Hex color
    pub cat: String,
}

pub fn init_db() -> Result<()> {
    let conn = Connection::open("dashboard.db")?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY,
            total_time TEXT,
            unlocks INTEGER,
            notifications INTEGER,
            score INTEGER,
            trend TEXT
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS segments (
            id INTEGER PRIMARY KEY,
            name TEXT,
            color TEXT,
            percent INTEGER
        )",
        [],
    )?;

    conn.execute("DROP TABLE IF EXISTS app_usage", [])?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS app_usage (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE,
            exe_path TEXT,
            icon_data TEXT,
            duration INTEGER DEFAULT 0
        )",
        [],
    )?;

    let count: i32 = conn.query_row("SELECT count(*) FROM stats", [], |row| row.get(0))?;
    if count == 0 {
        seed_data(&conn)?;
    }

    Ok(())
}

fn seed_data(conn: &Connection) -> Result<()> {
    conn.execute(
        "INSERT INTO stats (total_time, unlocks, notifications, score, trend) VALUES (?1, ?2, ?3, ?4, ?5)",
        params!["6h 19m", 12, 83, 68, "[4, 3, 6, 5, 8, 6, 2]"],
    )?;

    let segments = vec![
        ("Bilibili", "#64B5F6", 35),
        ("Moonlight", "#81C784", 20),
        ("贴吧", "#FFB74D", 15),
        ("Chrome", "#BA68C8", 10),
        ("其他", "#90A4AE", 20),
    ];
    for s in segments {
        conn.execute(
            "INSERT INTO segments (name, color, percent) VALUES (?1, ?2, ?3)",
            params![s.0, s.1, s.2],
        )?;
    }

    Ok(())
}

pub fn upsert_app_usage(app_name: &str, exe_path: &str, duration_delta: i64, check_icon: bool) -> Result<()> {
    let conn = Connection::open("dashboard.db")?;
    
    conn.execute(
        "INSERT INTO app_usage (name, exe_path, duration) VALUES (?1, ?2, ?3)
         ON CONFLICT(name) DO UPDATE SET duration = duration + ?3, exe_path = ?2",
        params![app_name, exe_path, duration_delta],
    )?;
    
    if check_icon {
        let icon_exists: bool = conn.query_row(
            "SELECT icon_data IS NOT NULL FROM app_usage WHERE name = ?1",
            params![app_name],
            |row| row.get(0)
        ).unwrap_or(false);

        if !icon_exists {
            drop(conn);

            if let Some(base64_icon) = icons::get_icon_base64(exe_path) {
                let conn = Connection::open("dashboard.db")?;
                let full_icon = format!("data:image/png;base64,{}", base64_icon);
                conn.execute(
                    "UPDATE app_usage SET icon_data = ?1 WHERE name = ?2",
                    params![full_icon, app_name],
                )?;
            }
        }
    }
    
    Ok(())
}

pub fn get_data() -> Result<(DashboardData, Vec<AppUsage>)> {
    let conn = Connection::open("dashboard.db")?;

    let mut stmt = conn.prepare("SELECT total_time, unlocks, notifications, score, trend FROM stats LIMIT 1")?;
    let stats_row = stmt.query_row([], |row| {
        let trend_str: String = row.get(4)?;
        let trend: Vec<i32> = serde_json::from_str(&trend_str).unwrap_or_default();
        Ok(DashboardData {
            total_time: row.get(0)?,
            unlocks: row.get(1)?,
            notifications: row.get(2)?,
            score: row.get(3)?,
            trend,
            segments: vec![],
        })
    })?;

    let mut data = stats_row;

    let total_seconds: i64 = conn.query_row(
        "SELECT COALESCE(SUM(duration), 0) FROM app_usage",
        [],
        |row| row.get(0),
    ).unwrap_or(0);

    data.total_time = format_duration(total_seconds);

    // Get Top 10 Apps (Combined Logic for Segments and App List)
    let mut stmt = conn.prepare("SELECT name, duration, icon_data FROM app_usage ORDER BY duration DESC LIMIT 10")?;
    let all_top_apps_iter = stmt.query_map([], |row| {
        Ok((
            row.get::<_, String>(0)?,
            row.get::<_, i64>(1)?,
            row.get::<_, Option<String>>(2)?
        ))
    })?;

    let mut all_apps_raw = Vec::new();
    for app in all_top_apps_iter {
        all_apps_raw.push(app?);
    }

    // Color Palette (10 distinct colors)
    let palette = vec![
        "#64B5F6", // Blue
        "#81C784", // Green
        "#FFB74D", // Orange
        "#BA68C8", // Purple
        "#F06292", // Pink
        "#4DB6AC", // Teal
        "#7986CB", // Indigo
        "#DCE775", // Lime
        "#FF8A65", // Deep Orange
        "#A1887F", // Brown
    ];

    // Build Segments (Top 4)
    let mut segments = Vec::new();
    let mut used_percent = 0;

    for (i, (name, duration, _)) in all_apps_raw.iter().take(4).enumerate() {
        if total_seconds > 0 {
            let percent = ((*duration as f64 / total_seconds as f64) * 100.0) as i32;
            if percent > 0 {
                segments.push(Segment {
                    name: name.clone(),
                    color: palette.get(i).unwrap_or(&"#90A4AE").to_string(),
                    percent
                });
                used_percent += percent;
            }
        }
    }

    if total_seconds > 0 && used_percent < 100 {
        segments.push(Segment {
            name: "其他".to_string(),
            color: "#90A4AE".to_string(),
            percent: 100 - used_percent
        });
    } else if total_seconds == 0 {
        segments.push(Segment {
            name: "无数据".to_string(),
            color: "#E0E9E2".to_string(),
            percent: 100
        });
    }

    data.segments = segments;

    // Build App List (Top 10)
    let mut apps = Vec::new();
    for (i, (name, duration, icon_data)) in all_apps_raw.into_iter().enumerate() {
        let time_str = format_duration(duration);
        let color = palette.get(i).unwrap_or(&"#90A4AE").to_string();

        let icon = if let Some(ic) = icon_data {
            ic
        } else {
            name.chars().next().unwrap_or('?').to_string().to_uppercase()
        };

        apps.push(AppUsage {
            name,
            time: time_str,
            icon,
            color,
            cat: "应用".to_string(),
        });
    }

    Ok((data, apps))
}

pub fn update_total_time(time: String) -> Result<()> {
    let conn = Connection::open("dashboard.db")?;
    conn.execute("UPDATE stats SET total_time = ?1", params![time])?;
    Ok(())
}

fn format_duration(secs: i64) -> String {
    let h = secs / 3600;
    let m = (secs % 3600) / 60;
    if h > 0 {
        format!("{}h {:02}m", h, m)
    } else {
        format!("{}m", m)
    }
}

fn get_app_styles(name: &str) -> (&'static str, &'static str, &'static str) {
    match name.len() % 5 {
        0 => ("bg-blue-50", "text-blue-600", "bg-blue-400"),
        1 => ("bg-emerald-50", "text-emerald-600", "bg-emerald-400"),
        2 => ("bg-amber-50", "text-amber-600", "bg-amber-400"),
        3 => ("bg-purple-50", "text-purple-600", "bg-purple-400"),
        _ => ("bg-sky-50", "text-sky-600", "bg-sky-400"),
    }
}
