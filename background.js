chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
        if (msg.action === 'startDeletion') {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: runOriginalScript,
                });
            });
        }
    });
});

function runOriginalScript() {
    function deleteVideoFromWatchLater() {
        video = document.getElementsByTagName('ytd-playlist-video-renderer')[0];
        video.querySelector('#primary button[aria-label="Action menu"]').click();
        var things = document.evaluate(
            '//span[contains(text(),"Remove from")]',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        for (var i = 0; i < things.snapshotLength; i++) {
            things.snapshotItem(i).click();
        }
    }

    async function deleteWatchLater() {
        // Fiddle with these if you'd like
        let batchSize = 200; // Number to delete at once before waiting
        let waitBetweenBatchesInMilliseconds = 1000 * 60 * 5; // 5 minutes
        let waitBetweenDeletionsInMilliseconds = 500; // Half a second

        let totalWaitTime = ((5000 / batchSize) * (waitBetweenBatchesInMilliseconds / 1000 / 60)) + (5000 * (waitBetweenDeletionsInMilliseconds / 1000 / 60))
        console.log(`Deletion will take around ${totalWaitTime.toFixed(0)} minutes to run if the playlist is full.`);

        let count = 0;
        while (true) {
            await new Promise(resolve => setTimeout(resolve, waitBetweenDeletionsInMilliseconds));
            deleteVideoFromWatchLater();
            count++;

            if (count % batchSize === 0 && count !== 0) {
                console.log('Waiting for 5 minutes...');
                await new Promise(resolve => setTimeout(waitBetweenBatchesInMilliseconds));
            }
        }
    }
    deleteWatchLater();
}
