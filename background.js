async function load() {

    messenger.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        // Check if the message includes our command member.
        if (message && message.hasOwnProperty("command")) {
            // Get the message currently displayed in the sending tab, abort if
            // that failed.
            const messageHeader = await messenger.messageDisplay.getDisplayedMessage(sender.tab.id);
            if (!messageHeader) {
                return;
            }
            // Check for known commands.
            switch (message.command) {
                case "checkIsSimulatedPhish":
                    // Create the information we want to return to our message display script.
                    const messagePart = await messenger.messages.getFull(messageHeader.id);
                    const messageMimeHeaders = messagePart.headers;

                    const report = " Report this e-mail to your IT department.";

                    // https://support.phishingbox.com/hc/en-us/articles/360024055754-Safelisting-Whitelisting-Basics
                    // https://twitter.com/_MG_/status/1472043904631394304
                    if ('x-phishtest' in messageMimeHeaders) {
                        return { is_phish_sim: true, text: "Phish Test header found." + report };
                    }

                    // https://www.spambrella.com/faq/searchable-header-in-mail-server-psat-educate/
                    if ('x-threatsim-id' in messageMimeHeaders || 'x-threatsim-header' in messageMimeHeaders) {
                        return { is_phish_sim: true, text: "ThreatSim header found." + report };
                    }

                    return { is_phish_sim: false, text: "No simulated phish header found."};
            }
        }
    });

    messenger.messageDisplayScripts.register({
        js: [{ file: "message-content-script.js" }],
        css: [{ file: "message-content-styles.css" }],
    });
}

document.addEventListener("DOMContentLoaded", load);
