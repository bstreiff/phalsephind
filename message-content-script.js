const showBanner = async () => {
    let bannerDetails = await browser.runtime.sendMessage({
        command: "checkIsSimulatedPhish",
    });

    // get the details back from the formerly serialized content
    const { text } = bannerDetails;

    if (bannerDetails.is_phish_sim) {

        // create the banner element itself
        const banner = document.createElement("div");
        banner.className = "phalsephindBanner";

        // create the banner text element
        const bannerText = document.createElement("div");
        bannerText.className = "phalsephindBannerText";
        bannerText.innerText = bannerDetails.text;

        // add text and button to the banner
        banner.appendChild(bannerText);

        // and insert it as the very first element in the message
        document.body.insertBefore(banner, document.body.firstChild);
    }
};

showBanner();
