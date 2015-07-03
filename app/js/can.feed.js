var FeedApp = can.Construct.extend({
    params: {
        link: "http://api.massrelevance.com/MassRelDemo/kindle.json",
        length: 10,
        interval: 10000,
        tag: "body"
    },
    data: {},
    timer: false
}, {
    init: function (params) {
        this.params = $.extend(this.params, params);
        this.refresh();
    },

    refresh: function () {
        console.log('Refresh!');
        var self = this;

        $.ajax( {
            type: "POST",
            url: self.params.link
        }).done(function(data) {
            if(data.length != "undefined") {
                self.data = data;
                self.view();
            }
        });
    },

    view: function () {
        var frag = can.view("app/tpl/feed.tpl", {
            params: this.params,
            data: this.getList()
        });

        $(this.params.tag).html(frag);

        if(!this.timer) this.startRefresh();
    },

    getList: function () {
        var new_data = [];

        for(var i=0; i<this.params.length; i++) {
            new_data.push(this.data[i]);
        }

        return new_data;
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
