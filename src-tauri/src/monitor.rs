use std::thread;
use std::time::Duration;
use std::collections::HashSet;
use active_win_pos_rs::get_active_window;
use crate::db;

pub fn start_tracking_loop() {
    thread::spawn(|| {
        let mut processed_apps = HashSet::new();

        loop {
            thread::sleep(Duration::from_secs(1));

            match get_active_window() {
                Ok(window) => {
                    let app_name = window.app_name;
                    let process_path = window.process_path.to_string_lossy().to_string();

                    if !app_name.is_empty() {
                        let check_icon = !processed_apps.contains(&app_name);

                        if let Err(e) = db::upsert_app_usage(&app_name, &process_path, 1, check_icon) {
                            eprintln!("Failed to update app usage: {}", e);
                        } else {
                            if check_icon {
                                processed_apps.insert(app_name);
                            }
                        }
                    }
                }
                Err(_) => {}
            }
        }
    });
}
