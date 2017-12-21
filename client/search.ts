namespace amura_topsearch {

    views.addInitFunction(initialize)

    function initialize() {
        let search = new ui.Autocomplete({
            loadURL: "/amura/topsearch/search.json",
            placeholder: T("@@Buscar cliente")
        })

        search.addEventListener("input", (e) => {
            e.preventDefault();
            search.control.value = "";
            if (e.value) {
                web.executeAction("/core/objects/show?name=amura.crm.client&id=" + e.value);
            }
        })

        let page = views.getPage();
        page.globalSearchPanel.appendChild(search.element)
    }

}