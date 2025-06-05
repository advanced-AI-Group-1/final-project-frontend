$features = @("chat-input", "chat-messages", "prompt-list", "session")
$folders = @("ui", "model", "api", "lib", "config")

foreach ($feature in $features) {
    foreach ($folder in $folders) {
        $path = "src\features\$feature\$folder\.gitkeep"
        Write-Output "Creating $path"
        $null > $path
    }
}
