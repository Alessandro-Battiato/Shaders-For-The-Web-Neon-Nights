const divs = document.querySelectorAll("div.shader");

divs.forEach((div) => {
    const img = div.querySelector("img");

    // replaces original images with canvases
    imagesLoaded(img, function () {
        const canvas = document.createElement("canvas");
        const sandbox = new GlslCanvas(canvas);
        div.append(canvas);
        div.classList.add("loaded");

        const sizer = function () {
            const w = img.clientWidth + 200;
            const h = img.clientHeight + 200;
            const dpi = window.devicePixelRatio;

            canvas.width = w * dpi;
            canvas.height = h * dpi;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            sandbox.setUniform("dpi", dpi);
        };

        let currentStrength = 1;
        let aimStrength = 1;

        sandbox.load(frag);
        sandbox.setUniform("image", img.currentSrc);
        sandbox.setUniform("strength", currentStrength);

        sizer();
        window.addEventListener("resize", function () {
            sizer();
        });

        // each time the user scrolls and sees an image once again, the effect will restart
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // intersectionRatio is basically asking "is this in the page?"
                    if (entry.intersectionRatio > 0) {
                        aimStrength = 0;
                    } else {
                        aimStrength = 1;
                    }
                });
            },
            {
                threshold: [0.0, 0.01, 1.0],
            }
        );

        observer.observe(img);

        const animate = function () {
            // code to animate current strength
            const diff = aimStrength - currentStrength;
            currentStrength += diff * 0.01;
            sandbox.setUniform("strength", currentStrength);

            requestAnimationFrame(animate);
        };

        animate();
    });
});
