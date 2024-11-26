export default class EndpointsAPI {
    
    apiBase:string = ""

    constructor(apiBase:string = "https://v2.api.noroff.dev") {
        this.apiBase = apiBase
    }

    get apiListingsPath() {
        return `${this.apiBase}/auction/listings`
    }

    get apiListingsQueryParam() {
        return `?_bids=true&_seller=true`
    }

    get apiListingsActiveParam() {
        return `&_active=true`
    }

    set token(accessToken: string) {
        localStorage.setItem("token", accessToken)
    }

    get token(): string | null {
        try {
            return localStorage.getItem("token")
        } catch {
            return null
        }
    }

    util = {
        setupHeaders: (body:boolean, token:boolean) => {
            const headers = new Headers()

            if (body) {
                headers.append("Content-Type", "application/json")
            }
            if (token) {
                headers.append("Authorization", `Bearer ${this.token}`)
            }

            return headers
        }
    }

    listings = {
        readAll: async (parameter:string) => {
            const url = new URL(`${this.apiListingsPath}${this.apiListingsQueryParam}${parameter}`)
            console.log(url);
            
            const response = await fetch(url, {
                headers: this.util.setupHeaders(true, false),
                method: "GET",
            })

            if (response.ok) {
                const { data } = await response.json()
                return data
            }
            throw new Error("Could not fetch listings.")
        }
    }
}