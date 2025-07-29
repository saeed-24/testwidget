JFCustomWidget.subscribe('ready', function(formId, value) {
  const apiKey     = JFCustomWidget.getWidgetSetting('openAIKey');
  const btn        = document.getElementById('generate');
  const pointsArea = document.getElementById('points');
  const reportArea = document.getElementById('report');

  // if editing an existing submission, preload the report
  if (value) {
    reportArea.value = value;
  }

  // send back whatever’s in reportArea on any change
  reportArea.addEventListener('input', () => {
    JFCustomWidget.sendSubmit({ valid: true, value: reportArea.value });
  });

  btn.addEventListener('click', async () => {
    const raw = pointsArea.value.trim();
    if (!raw) {
      reportArea.value = 'please enter some points above first';
      return;
    }
    reportArea.value = 'working on your report…';

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey
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
      const json   = await res.json();
      const report = json.choices?.[0]?.message?.content || '';
      reportArea.value = report || 'no report returned – check your console';
      JFCustomWidget.sendSubmit({ valid: true, value: reportArea.value });
    }
    catch (err) {
      console.error(err);
      reportArea.value = 'error generating report – see console';
    }
  });
});
