// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod monitor;
mod icons;

use serde::Serialize;

#[derive(Serialize)]
struct DashboardResponse {
    dashboard: db::DashboardData,
    apps: Vec<db::AppUsage>,
}

#[tauri::command]
fn get_dashboard_data() -> Result<DashboardResponse, String> {
    match db::get_data() {
        Ok((dashboard, apps)) => Ok(DashboardResponse { dashboard, apps }),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn refresh_stats() -> Result<String, String> {
    Ok("Refreshed".to_string())
}

fn main() {
    // Init DB
    if let Err(e) = db::init_db() {
        eprintln!("Failed to init db: {}", e);
    }

    // Start system monitoring
    monitor::start_tracking_loop();

    tauri::Builder::default()
        .on_window_event(|event| {
            if let tauri::WindowEvent::Destroyed = event.event() {
                std::process::exit(0);
            }
        })
        .invoke_handler(tauri::generate_handler![get_dashboard_data, refresh_stats])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
