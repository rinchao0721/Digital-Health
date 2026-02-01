use std::process::Command;
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

pub fn get_icon_base64(path: &str) -> Option<String> {
    let ps_script = format!(
        r#"
        Add-Type -AssemblyName System.Drawing
        $path = '{}'
        if (-not (Test-Path $path -PathType Leaf)) {{
            Write-Error "File not found: $path"
            exit 1
        }}
        try {{
            $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($path)
            if ($null -eq $icon) {{ exit 1 }}
            $bitmap = $icon.ToBitmap()
            $stream = New-Object System.IO.MemoryStream
            $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
            $bytes = $stream.ToArray()
            $base64 = [Convert]::ToBase64String($bytes)
            [Console]::Out.Write($base64)
        }} catch {{
            [Console]::Error.Write($_.Exception.Message)
            exit 1
        }}
        "#,
        path.replace("'", "''")
    );

    let output_result = Command::new("C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe")
        .args(&["-NoProfile", "-NonInteractive", "-Command", &ps_script])
        .creation_flags(0x08000000)
        .output();

    match output_result {
        Ok(output) => {
             if !output.status.success() {
                let stderr = String::from_utf8_lossy(&output.stderr);
                println!("Icon extraction failed for path: {}\nError: {}", path, stderr);
                return None;
            }

            let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !stdout.is_empty() {
                return Some(stdout);
            } else {
                println!("Icon extraction returned empty. Stdout raw: {:?}", output.stdout);
            }
            None
        },
        Err(e) => {
            println!("Failed to execute PowerShell command: {}", e);
            None
        }
    }
}
