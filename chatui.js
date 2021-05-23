const chatApp = {
    data() {
        return {
            username: null,
            password: null,
            token: null,
            messageText: null,
            messages: []
        }
    },
    watch: {
        messages() {
            console.debug("Messages changed");
            this.scroll();
        }
    },
    methods: {
        login() {
            console.debug("Start logging in");
            fetch("https://chat-api.bug.guru/tokens", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": this.username,
                    "password": this.password
                })
            }).then(response => {
                if (response.ok) {
                    console.debug("Login response is OK");
                    return response.json();
                } else {
                    console.error("Login failed");
                }
            }).then(data => {
                console.debug("Received token", data);
                this.token = data.token;
            });
        },
        register() {
            console.debug("Start registration");
            fetch("https://chat-api.bug.guru/users", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": this.username,
                    "password": this.password
                })
            }).then(response => {
                if (response.ok) {
                    console.debug("Registration is successful");
                    return response.json();
                } else {
                    console.error("Registration is unsuccessful");
                }
            }).then(data => {
                console.debug("Received login", data);
                this.login();
            });
        },
        addMessage() {
            console.debug("Adding message");
            fetch("https://chat-api.bug.guru/messages", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.token
                },
                body: JSON.stringify({
                    "text": this.messageText
                })
            }).then(response => {
                if (response.ok) {
                    console.debug("Adding message response OK");
                    return response.json();
                } else {
                    console.error("Adding message error");
                }
            }).then(data => {
                console.debug("Added message", data);
                this.messages.push(data);
                this.refreshMessages();
                this.messageText = null;
                this.$refs.message.focus();
            });
        },
        refreshMessages() {
            console.log("Loading messages");
            fetch("https://chat-api.bug.guru/messages", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if (response.ok) {
                    console.debug("Response is OK");
                    return response.json();
                } else {
                    console.error("Response error");
                }
            }).then(data => {
                console.debug("Received data", data);
                this.messages = data;
            });
        },
        scroll() {
            const md = this.$refs.messages;
            console.debug("Scrolling", md);
            setTimeout(function () {md.scrollTop = md.scrollHeight;}, 1);
        }
    },
    mounted() {
        console.debug("Starting app...");
        this.refreshMessages();
        setInterval( () => this.refreshMessages(), 10000);
    }
};

Vue.createApp(chatApp).mount('#app');