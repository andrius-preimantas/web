odoo.define('base_search_and.search_and', function(require) {
    "use strict";
    var SearchInputs = require('web.search_inputs');
    var SearchView = require('web.SearchView');

    var SearchQueryExtended = SearchView.SearchQuery.extend({
        add: function (values, options) {
            options = options || {};

            if (!values) {
                values = [];
            } else if (!(values instanceof Array)) {
                values = [values];
            }

            if (options.shiftKey) {
                delete options.shiftKey;
                _(values).each(function (value) {
                    var model = this._prepareModel(value, options);
                    Backbone.Collection.prototype.add.call(this, model, options);
                }, this);
                return this;
            }
            else {
                return this.constructor.__super__.add.apply(this, arguments);
            }
        },
    });
    SearchView.include({
        start: function() {
            var res = this._super();
            this.query = new SearchQueryExtended()
                .on('add change reset remove', this.proxy('do_search'))
                .on('change', this.proxy('renderChangedFacets'))
                .on('add reset remove', this.proxy('renderFacets'));
            return res;
        },
        select_completion: function (e, ui) {
            var self = this;
            if (e.shiftKey) {
                e.preventDefault();

                var input_index = _(this.input_subviews).indexOf(
                    this.subviewForRoot(
                        this.$('div.oe_searchview_input:focus')[0]));
                        this.query.add(ui.item.facet, {at: input_index / 2, shiftKey: true});
            } else {
                this._super(e, ui);
            }
        },
    });
});
