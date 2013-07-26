define(['services/logger'], function (logger) {
    ko.bindingHandlers.tooltip = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
            $(element).tooltip({
                title: valueUnwrapped
            });
        },
    };

    ko.bindingHandlers.returnAction = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = ko.utils.unwrapObservable(valueAccessor());

            $(element).keydown(function (e) {
                if (e.which === 13) {
                    value(viewModel);
                }
            });
        }
    };
});