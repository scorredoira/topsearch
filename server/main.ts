import "lib/std"
import * as web from "lib/web";

function init() {
    web.addClientFiles([
        "/public/amura/topsearch/search.js",
    ])

    web.addRoute("/amura/topsearch/search.json", searchHandler, web.adminFilter)
}

function searchHandler(c: web.Context) {
    let search = c.request.value("search")

    // add wildcards only if there arent explicitly set
    if (!search.hasPrefix("%") && !search.hasSuffix("%")) {
        search = "%" + search + "%"
    }

    let items = sql.query(`SELECT id, name, lastName, email, phone
                           FROM amura:crm:client
                           WHERE name LIKE ? 
                           OR lastName LIKE ? 
                           OR email LIKE ? 
                           OR phone LIKE ?
                           ORDER BY lastName, name
                           LIMIT 30`, search, search, search, search)

    let result = items.select(t => {
        return { id: t.id, text: fullName(t) }
    })

    c.response.writeJSON(result)
}

function fullName(row: any) {
    let data = [];
    if (row.name) {
        data.push(row.name)
    }
    if (row.lastName) {
        data.push(row.lastName)
    }
    if (row.email) {
        data.push("<" + row.email + ">")
    }
    if (row.phone) {
        data.push(row.phone)
    }
    return data.join(", ");
}