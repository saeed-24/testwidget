;(function() {
  // wait for the form to load
  document.addEventListener('DOMContentLoaded', function() {
    const notesField = document.getElementById('input_4');
    if (!notesField) return;

    // create container under the Notes field
    const container = document.createElement('div');
    container.style.marginTop = '12px';

    // generate button
    const btn = document.createElement('button');
    btn.textContent = 'Generate Surveillance Report';
    btn.style.padding = '8px 12px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';

    // editable report textarea
    const reportArea = document.createElement('textarea');
    reportArea.name = 'q4_report';           // name used in submission
    reportArea.placeholder = 'your report will appear here';
    reportArea.style.width = '100%';
    reportArea.style.height = '200px';
    reportArea.style.marginTop = '8px';
    reportArea.style.padding = '6px';
    reportArea.style.border = '1px solid #ccc';
    reportArea.style.resize = 'vertical';

    container.appendChild(btn);
    container.appendChild(reportArea);
    notesField.parentNode.appendChild(container);

    btn.addEventListener('click', async function() {
      const raw = notesField.value.trim();
      if (!raw) {
        reportArea.value = 'please fill in the Notes field first';
        return;
      }
      reportArea.value = 'working on your report…';

      try {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'you are an expert at writing concise, professional surveillance reports based on raw notes' },
              { role: 'user',   content: raw }
            ],
            max_tokens: 800,
            temperature: 0.2
          })
        });

        const json = await resp.json();
        const report = json.choices?.[0]?.message?.content || '';
        reportArea.value = report;
      }
      catch (e) {
        console.error(e);
        reportArea.value = 'error generating report – check console';
      }
    });
  });
})();
