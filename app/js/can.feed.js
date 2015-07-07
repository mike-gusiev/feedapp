var FeedApp = can.Control.extend({
    params: {
        link: "http://api.massrelevance.com/MassRelDemo/kindle.json",
        limit: 10,
        interval: 10000
    },

    data: {},
    timer: false,
    firstRun: true,
    lastAjax: true,

    init: function () {
        this.params = $.extend(this.params, this.options);
        this.refresh();
    },

    refresh: function () {
        if(this.lastAjax == false) return;

        this.lastAjax = false;
        $.ajax({
            type: "POST",
            url: this.params.link,
            context: this,
            data: {
                limit: this.params.limit,
                since_id: this.last_id
            }
        }).done(this.parse);
    },

    parse: function (data) {
        console.log("Refresh:", data);
        this.lastAjax = true;

        if(data.length) {
            this.last_id = data[0].id_str
            this.build(data);
        }
    },

    build: function (newData) {
        if(this.firstRun) {
            this.view(newData);
            return;
        }

        var self = this;
        newData.map(function (item) {
            self.data.unshift(item);

            if(self.data.length > self.params.limit) self.data.pop();
        });
    },

    view: function (data) {
        this.data = new can.List(data);

        var mainHTML = can.view("app/tpl/main.tpl", {
            data: this.data
        });

        $(this.element).html(mainHTML);


        var itemHTML = can.view("app/tpl/item.tpl", {
            data: this.data
        });

        $('#feed-list').html(itemHTML);


        if(!this.timer) this.startRefresh();
        this.firstRun = false;
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
