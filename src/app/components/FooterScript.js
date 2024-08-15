import Script from "next/script";

const FooterScript = () => {
    return(

        <>
            <Script src="/js/vendor/jquery.min.js"></Script>
            <Script src="/js/plugins/audio.js"></Script>
            <Script src="/js/vendor/bootstrap.min.js"></Script>
            <Script src="/js/vendor/swiper.js"></Script>
            <Script src="/js/vendor/metisMenu.min.js"></Script>
            <Script src="/js/plugins/audio.js"></Script>
            <Script src="/js/plugins/magnific-popup.js"></Script>
            <Script src="/js/plugins/contact-form.js"></Script>
            <Script src="/js/plugins/resize-sensor.min.js"></Script>
            <Script src="/js/plugins/theia-sticky-sidebar.min.js"></Script>
            <Script src="/js/main.js"></Script>
        </>
    );
}

export default FooterScript;