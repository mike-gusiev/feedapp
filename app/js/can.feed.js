var FeedApp = can.Control.extend({
    params: {
        link: "http://api.massrelevance.com/MassRelDemo/kindle.json",
        limit: 10,
        interval: 10000
    },

    data: {},
    timer: false,
    firstRun: true,

    init: function (el, params) {
        this.params = $.extend(this.params, params);
        this.refresh();
    },

    refresh: function () {
        var self = this;

        $.ajax( {
            type: "POST",
            url: self.params.link,
            data: {
                limit: self.params.limit,
                since_id: self.last_id
            }
        }).done(function(data) {
            console.log("Refresh:", data);

            if(data.length === "undefined") return;

            if(data.length) {
                self.last_id = data[0].id_str
                self.view(data);
            }
        });
    },

    view: function (data) {

        if(this.firstRun) {
            this.viewFirst(data);
            return;
        }

        var self = this;

        data.map(function (item) {

            self.data.unshift(item);
            self.data.pop();

            var itemHTML = can.view("app/tpl/feed.tpl", {
                params: self.params,
                data: [item],
                firstRun: false
            });

            $("#feed-list").prepend(itemHTML);
            $("#feed-list .panel").last().remove();

        });
    },

    viewFirst: function (data) {
        this.data = data;

        var frag = can.view("app/tpl/feed.tpl", {
            params: this.params,
            data: this.getList(),
            firstRun: true
        });

        $(this.element).html(frag);

        if(!this.timer) this.startRefresh();
        this.firstRun = false;
    },

    getList: function () {
        var newData = [];

        for(var i=0; i<this.params.limit; i++) {
            if(i >= this.data.length) break;

            newData.push(this.data[i]);
        }

        return newData;
    },

    startRefresh: function () {
        var self = this;

        this.timer = setInterval(function () {
            self.refresh();
        }, this.params.interval);
    },

    stopRefresh: function () {
        clearInterval(this.timer);
    }
});
