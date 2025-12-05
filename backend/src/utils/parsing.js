const chrono = require('chrono-node');

function parseTask(transcript) {
    if (!transcript) return null;

    // 1. Parse Date (Find best match)
    const parsedResults = chrono.parse(transcript);
    let parsedDate = null;

    if (parsedResults.length > 0) {
        // Prefer the result that has a known time component
        const resultWithTime = parsedResults.find(r => r.start.knownValues.hour !== undefined);
        if (resultWithTime) {
            parsedDate = resultWithTime.start.date();
        } else {
            parsedDate = parsedResults[0].start.date();
        }
    }

    // 2. Parse Priority
    let priority = 'medium';
    const lowerTranscript = transcript.toLowerCase();
    if (lowerTranscript.includes('urgent') || lowerTranscript.includes('high priority') || lowerTranscript.includes('critical')) {
        priority = 'high';
    } else if (lowerTranscript.includes('low priority')) {
        priority = 'low';
    }

    // 3. Parse Status
    let status = 'todo';
    if (lowerTranscript.includes('done') || lowerTranscript.includes('completed')) {
        status = 'done';
    } else if (lowerTranscript.includes('in progress') || lowerTranscript.includes('doing')) {
        status = 'in-progress';
    }

    // 4. Parse Title (Remove date/priority keywords)
    let title = transcript;

    // Remove priority keywords
    title = title.replace(/urgent|high priority|critical|low priority/gi, '').trim();

    // Remove ALL date text found
    if (parsedResults.length > 0) {
        parsedResults.forEach(result => {
            title = title.replace(result.text, '');
        });
    }

    // Clean up
    title = title.replace(/\s+/g, ' ').trim();
    title = title.replace(/^(remind me to|create a task to|add a task to|create task|add task)\s+/i, '');

    return {
        title,
        priority,
        dueDate: parsedDate,
        status
    };
}

module.exports = { parseTask };
