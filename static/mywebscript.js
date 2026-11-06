let RunSentimentAnalysis = () => {
    let textToAnalyze = document.getElementById("textToAnalyze").value;
    let runBtn = document.getElementById("runBtn");
    let originalBtnHtml = runBtn ? runBtn.innerHTML : null;
    let systemResponseEl = document.getElementById("system_response");
    let visualBreakdown = document.getElementById("visual_breakdown");
    let resultCard = document.getElementById("resultCard");

    // UI Loading state
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Analyzing...';
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            // Restore button state
            if (runBtn && originalBtnHtml) {
                runBtn.disabled = false;
                runBtn.innerHTML = originalBtnHtml;
            }

            if (this.status == 200) {
                let responseText = xhttp.responseText.trim();
                systemResponseEl.innerHTML = responseText;

                // Handle invalid text response
                if (responseText.toLowerCase().includes("invalid text")) {
                    systemResponseEl.classList.remove("d-none");
                    systemResponseEl.className = "alert alert-warning d-flex align-items-center mb-0";
                    systemResponseEl.innerHTML = '<i class="bi bi-exclamation-triangle-fill text-warning me-2 fs-5"></i> ' +
                        '<span class="fw-semibold">' + responseText + '</span>';
                    if (visualBreakdown) visualBreakdown.classList.add("d-none");
                    if (resultCard) resultCard.style.borderColor = "#f59e0b";
                    return;
                }

                // Normal response styling: Hide system_response and only show visual breakdown
                systemResponseEl.classList.add("d-none");
                if (resultCard) resultCard.style.borderColor = "#6366f1";

                // Parse emotions & display visual breakdown if element exists
                renderVisualBreakdown(responseText);
            } else {
                systemResponseEl.classList.remove("d-none");
                systemResponseEl.className = "alert alert-danger mb-0";
                systemResponseEl.innerHTML = '<i class="bi bi-x-circle-fill me-2"></i> Error: ' + xhttp.status + " " + xhttp.statusText;
                if (visualBreakdown) visualBreakdown.classList.add("d-none");
            }
        }
    };
    xhttp.open("GET", "emotionDetector?textToAnalyze=" + encodeURIComponent(textToAnalyze), true);
    xhttp.send();
};

function renderVisualBreakdown(rawText) {
    let visualBreakdown = document.getElementById("visual_breakdown");
    let dominantBadge = document.getElementById("dominantBadge");
    let scoresGrid = document.getElementById("scoresGrid");

    if (!visualBreakdown || !dominantBadge || !scoresGrid) return;

    // Regex extract values
    let angerMatch = rawText.match(/'anger':\s*([0-9.]+)/i);
    let disgustMatch = rawText.match(/'disgust':\s*([0-9.]+)/i);
    let fearMatch = rawText.match(/'fear':\s*([0-9.]+)/i);
    let joyMatch = rawText.match(/'joy':\s*([0-9.]+)/i);
    let sadnessMatch = rawText.match(/'sadness':\s*([0-9.]+)/i);
    let dominantMatch = rawText.match(/dominant emotion is\s+([a-zA-Z]+)/i);

    if (!dominantMatch) {
        visualBreakdown.classList.add("d-none");
        let systemResponseEl = document.getElementById("system_response");
        if (systemResponseEl) systemResponseEl.classList.remove("d-none");
        return;
    }

    let dominant = dominantMatch[1].toLowerCase();
    let emotions = [
        { name: "anger", label: "Anger", icon: "😡", colorClass: "anger-fill", score: angerMatch ? parseFloat(angerMatch[1]) : 0 },
        { name: "disgust", label: "Disgust", icon: "🤢", colorClass: "disgust-fill", score: disgustMatch ? parseFloat(disgustMatch[1]) : 0 },
        { name: "fear", label: "Fear", icon: "😨", colorClass: "fear-fill", score: fearMatch ? parseFloat(fearMatch[1]) : 0 },
        { name: "joy", label: "Joy", icon: "😃", colorClass: "joy-fill", score: joyMatch ? parseFloat(joyMatch[1]) : 0 },
        { name: "sadness", label: "Sadness", icon: "😢", colorClass: "sadness-fill", score: sadnessMatch ? parseFloat(sadnessMatch[1]) : 0 }
    ];

    let emojiMap = {
        joy: "😃 Joy",
        anger: "😡 Anger",
        fear: "😨 Fear",
        sadness: "😢 Sadness",
        disgust: "🤢 Disgust"
    };

    dominantBadge.innerHTML = (emojiMap[dominant] || dominant.toUpperCase());

    // Generate score bars
    let html = "";
    emotions.forEach(e => {
        let pct = Math.round(e.score * 100);
        let isDominant = e.name === dominant;
        html += `
            <div class="col-12 col-sm-6">
                <div class="p-2 rounded ${isDominant ? 'bg-light border border-primary-subtle' : ''}">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="small fw-semibold text-dark">
                            ${e.icon} ${e.label} ${isDominant ? '<span class="badge bg-primary-subtle text-primary ms-1" style="font-size: 0.65rem">TOP</span>' : ''}
                        </span>
                        <span class="small font-monospace text-secondary">${e.score.toFixed(4)} (${pct}%)</span>
                    </div>
                    <div class="emotion-bar-track">
                        <div class="emotion-bar-fill ${e.colorClass}" style="width: ${Math.max(pct, 2)}%"></div>
                    </div>
                </div>
            </div>
        `;
    });

    scoresGrid.innerHTML = html;
    visualBreakdown.classList.remove("d-none");
}
