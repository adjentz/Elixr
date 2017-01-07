let directive: angular.IDirective = {
    name: "rpgHideOnScrollDown",
    link: (scope, elem) => {
        let windowScroll = window.scrollY;

        window.addEventListener("scroll", () => {
            if (window.scrollY > windowScroll) {
                if (!elem.hasClass("header-unfixed")) {
                    elem.addClass("header-unfixed")
                }
            }
            else {
                elem.removeClass("header-unfixed");
            }
            windowScroll = window.scrollY;
        });
    },
};

export default directive;