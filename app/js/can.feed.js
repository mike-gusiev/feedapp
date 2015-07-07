var FeedApp = can.Control.extend({
    defaults: {
        link: "http://api.massrelevance.com/MassRelDemo/kindle.json",
        limit: 10,
        interval: 10000
    },
    data: {},
    timer: false,
    lastAjax: true
}, {
    init: function () {
        console.log(this.options);

        this.data = new can.List();
        this.view();

        this.startRefresh();
    },

    view: function () {
        var mainHTML = can.view("app/tpl/main.tpl", {
            data: this.data
        });

        $(this.element).html(mainHTML);
    },

    refresh: function () {
        if(this.lastAjax == false) return;

        this.lastAjax = false;
        $.ajax({
            type: "POST",
            url: this.options.link,
            context: this,
            data: {
                limit: this.options.limit,
                since_id: this.last_id
            }
        }).done(this.parse);
    },

    parse: function (data) {
        console.log("Refresh:", data);
        this.lastAjax = true;

        if(data.length) {
            this.last_id = data[0].id_str
            this.addNew(data);
        }
    },

    addNew: function (newData) {
        var self = this;

        can.batch.start();
        newData.map(function (item) {
            self.data.unshift(item);

            if(self.data.length > self.options.limit) self.data.pop();
        });
        can.batch.stop();
    },

    startRefresh: function () {
        this.refresh();
        var self = this;

        this.timer = setInterval(function () {
            self.refresh();
        }, this.options.interval);
    },

    stopRefresh: function () {
        clearInterval(this.timer);
    }
});
