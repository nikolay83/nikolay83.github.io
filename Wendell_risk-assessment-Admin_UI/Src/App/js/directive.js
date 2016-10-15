/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application directives.
 *
 * Changes in 1.1:
 *  - Added new directives 'showDialog', 'closeDialog', 'checklistModel'
 *  - updated datepicker directive to update calendar from value
 * @author veshu
 * @version 1.1
 */
(function () {
    'use strict';

    var app = angular.module('app');

    // date picker
    app.directive('datePicker', function () {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                var updateModel = function (ev) {
                    scope.$apply(function () {
                        controller.$setViewValue(moment(ev.date).format("YYYY-MM-DD"));
                    });
                };
                var options = {
                    format: 'dd-mm-yyyy',
                    todayHighlight: false
                };
                element.datepicker(options).on('changeDate', updateModel);
                $('.datepicker table').each(function () {
                    if (!$(this).find('.ok-btn').length) {
                        $(this).append('<tfoot><tr><th colspan="7" style="background: #798B9A; width: 100%; height: 29px; line-height: 29px; border-radius: 0; ">' +
                            '<a href="javascript:;" style="color: #FFF; width: 100%;" class="fl ok-btn">OK</a></th></tr></tfoot>');
                        $(this).find('.ok-btn').on('click', function () {
                            $('.datepicker').hide();
                        });
                    }
                });
                if (attrs.ngModel) {
                    scope.$watch(attrs.ngModel, function (value) {
                        if (value) {
                            element.datepicker('setValue', moment(value, "YYYY-MM-DD"));
                        }
                    });
                }
            }
        };
    });

    /**
     * Date picker input directive
     */
    app.directive('datepickerInput', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function () {
                    $(this).siblings('input').trigger('focus');
                });
            }
        };
    }]);

    /**
     * tool tips for multiple select
     */
    app.directive('toolTips', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                function showTip(element, html, adjust) {
                    if (!$('#tips').length) {
                        $('<div id="tips" class="tips"><div class="content">' + html + '</div><div class="arrow-down"></div></div>').appendTo('body');
                    } else {
                        $('#tips .content').html(html);
                    }
                    var top = element.offset().top - $('#tips').height() - 33;
                    var left = element.offset().left - 15;
                    if (adjust) {
                        top = top - 7;
                        left = left - 8;
                    }
                    $('#tips').css({
                        'top': top,
                        'left': left
                    }).show();
                }

                element.find("button.ms-choice").hover(function () {
                    $(this).closest('.inputs').find('select').multipleSelect('refresh');
                    var selects = $(this).closest('.inputs').find('select').multipleSelect('getSelects', 'text');
                    var html = '';
                    if (attrs.preMessage && $(this).closest('.inputs').find('.ms-drop ul li').length <= 0) {
                        html = attrs.preMessage;
                    } else if (selects.length) {
                        html = '<ul>';
                        for (var i = 0; i < selects.length; ++i) {
                            html += '<li>' + selects[i] + '</li>';
                        }
                        html += '</ul>';
                    } else {
                        html = 'Nothing selected';
                    }
                    showTip($(this), html);
                }, function () {
                    $('#tips').remove();
                });
            }
        };
    });

    /**
     * Updates the height of text area as required by text
     */
    app.directive('autoGrow', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('keyup', function () {
                    element[0].style.height = "20px";
                    element[0].style.height = (element[0].scrollHeight + 3) + "px";
                });
            }
        };
    });

    /**
     * Shows the JQuery dialog
     */
    app.directive('showDialog', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    $(attrs.targetId).dialog({
                        resizable: false,
                        height: 300,
                        modal: true,
                        dialogClass: "no-close",
                        closeOnEscape: false
                    });

                });
            }
        };
    });

    /**
     * Closes the JQuery dialog
     */
    app.directive('closeDialog', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    $(attrs.targetId).dialog('close');
                });
            }
        };
    });

    /**
     * Build the control types dropdown.
     */
    app.directive('controlTypeSelect', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                function populateData(assessment, controlTypes) {
                    $.each(element.next('div.ms-parent').find('input:checkbox'), function (i, checkbox) {
                        var $that = $(this);
                        if ($(checkbox).val().indexOf('other') !== -1) {
                            if ($(checkbox).prop('checked') || assessment.otherNames[$(checkbox).val()] !== undefined) {
                                var template = $('<nobr><input type="text" name="other" width = "50%" maxlength="200" class="other-input" placeholder=""/>\
                <span class="char-count">0/200</span>\
                <a href="javascript:;" class="btn-small btn-small-primary" >Save</a></nobr>');
                                var text = template.find('input:text');
                                text.val(assessment.otherNames[$(checkbox).val()]);
                                var count = text.val().length;
                                text.next('span.char-count').text(count + '/' + (200 - count));
                                $(checkbox).parent().parent().after(template);
                                template.find('a').on('click', function () {
                                    element.next('div.ms-parent').find('div.ms-drop').hide();
                                });
                                template.find('input:text').on('keyup', function () {
                                    var index = template.prev('li').find('input:checkbox').val();
                                    if (!controlTypes.otherNames) {
                                        controlTypes.otherNames = [];
                                    }
                                    assessment.otherNames[index] = $(this).val();
                                    scope.$apply(function () {
                                        if (!assessment.inputs) {
                                            assessment.inputs = [];
                                        }
                                        assessment.inputs.push({});
                                        assessment.inputs.splice(assessment.inputs.length - 1, 0);
                                    });
                                    var span = $(this).next('span.char-count');
                                    var count = $(this).val().length
                                    span.text(count + '/' + (200 - count));
                                });
                            }
                        }
                    });
                }

                var assessment = scope.$eval(attrs.controlTypeSelect.replace('.controlTypes', ''));
                if (assessment) {
                    if (!assessment.otherNames) {
                        assessment.otherNames = {};
                    }
                    scope.$watch(attrs.controlTypeSelect, function (controlTypes) {
                        setTimeout(function () {
                            populateData(assessment, controlTypes);
                        }, 100);
                    });
                }
            }
        };
    });

    /**
     * Close the multiple drop down when clicking on other places on the web page
     */
    app.directive('closeDrop', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(document).click(function (e) {
                    var that = element.next('div.ms-parent');
                    if ($(e.target)[0] === that.find('button.ms-choice')[0] ||
                        $(e.target).parents('.ms-choice')[0] === that.find('button.ms-choice')[0] ||
                        $(e.target).attr('name') === 'selectItem') {
                        return;
                    }
                    if (($(e.target)[0] === that.find('div.ms-drop')[0] ||
                        $(e.target).parents('.ms-drop')[0] !== that.find('div.ms-drop')[0])) {
                        element.multipleSelect('close');
                    }
                });
            }
        };
    });

    /**
     * Build the SLAs dropdown.
     */
    app.directive('serviceLevelSelect', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                function populateData(assessment, controlTypes) {
                    $.each(element.next('div.ms-parent').find('input:radio'), function (i, radioButton) {
                        if ($(radioButton).val().indexOf('other') !== -1) {
                            if ($(radioButton).prop('checked', true) || assessment.additionalSLA !== undefined) {
                                var template = $('<nobr><input type="text" name="other" width = "50%" maxlength="200" class="other-input" placeholder=""/>\
                <span class="char-count">0/200</span>\
                <a href="javascript:;" class="btn-small btn-small-primary" >Save</a></nobr>');
                                var text = template.find('input:text');
                                text.val(assessment.additionalSLA);
                                var count = text.val().length;
                                text.next('span.char-count').text(count + '/' + (200 - count));
                                $(radioButton).parent().parent().after(template);
                                template.find('a').on('click', function () {
                                    element.next('div.ms-parent').find('button.ms-choice').find('span').text(template.find('input:text').val());
                                    element.next('div.ms-parent').find('div.ms-drop').hide();
                                });
                                template.find('input:text').on('keyup', function () {
                                    assessment.additionalSLA = $(this).val();
                                    element.next('div.ms-parent').find('button.ms-choice').find('span').text($(this).val());
                                    var span = $(this).next('span.char-count');
                                    var count = $(this).val().length
                                    span.text(count + '/' + (200 - count));
                                });
                            }
                        }
                    });
                }

                var assessment = scope.$eval(attrs.serviceLevelSelect.replace('.selectedSLA', ''));
                if (assessment) {
                    scope.$watch(attrs.serviceLevelSelect, function (selectedSLA) {
                        setTimeout(function () {
                            populateData(assessment, selectedSLA);
                        }, 100);
                    });
                }
            }
        };
    });

    /**
     * tool tips for table header from message
     */
    app.directive('customToolTips', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                function showTip(element, html, adjust) {
                    if (!$('#tips').length) {
                        $('<div id="tips" class="tips thtips"><div class="content">' + html + '</div><div class="arrow-down"></div></div>').appendTo('body');
                    } else {
                        $('#tips .content').html(html);
                    }
                    var top = element.offset().top - $('#tips').height() - 33;
                    var left = element.offset().left - 25;
                    if (adjust) {
                        top = top - 7;
                        left = left - 8;
                    }
                    $('#tips').css({
                        'top': top,
                        'left': left
                    }).show();
                }
                element.hover(function () {
                    var mssage = attrs.ctMessage;
                    var html = '<ul>';
                    html += '<li>' + mssage + '</li>';
                    html += '</ul>';
                    showTip($(this), html);
                }, function () {
                    $('#tips').remove();
                });
            }
        };
    });

    /**
     * Checklist-model
     * AngularJS directive for list of checkboxes
     * https://github.com/vitalets/checklist-model
     * License: MIT http://opensource.org/licenses/MIT
     */
    app.directive('checklistModel', ['$parse', '$compile', function ($parse, $compile) {
        // contains
        function contains(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // add
        function add(arr, item, comparator) {
            arr = angular.isArray(arr) ? arr : [];
            if (!contains(arr, item, comparator)) {
                arr.push(item);
            }
            return arr;
        }

        // remove
        function remove(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }
            return arr;
        }

        // http://stackoverflow.com/a/19228302/1458162
        function postLinkFn(scope, elem, attrs) {
            // exclude recursion, but still keep the model
            var checklistModel = attrs.checklistModel;
            attrs.$set("checklistModel", null);
            // compile with `ng-model` pointing to `checked`
            $compile(elem)(scope);
            attrs.$set("checklistModel", checklistModel);

            // getter / setter for original model
            var getter = $parse(checklistModel);
            var setter = getter.assign;
            var checklistChange = $parse(attrs.checklistChange);
            var checklistBeforeChange = $parse(attrs.checklistBeforeChange);

            // value added to list
            var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


            var comparator = angular.equals;

            if (attrs.hasOwnProperty('checklistComparator')) {
                if (attrs.checklistComparator[0] == '.') { //jshint ignore:line
                    var comparatorExpression = attrs.checklistComparator.substring(1);
                    comparator = function (a, b) {
                        return a[comparatorExpression] === b[comparatorExpression];
                    };

                } else {
                    comparator = $parse(attrs.checklistComparator)(scope.$parent);
                }
            }

            // watch UI checked change
            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                    scope[attrs.ngModel] = contains(getter(scope.$parent), value, comparator);
                    return;
                }

                setValueInChecklistModel(value, newValue);

                if (checklistChange) {
                    checklistChange(scope);
                }
            });

            function setValueInChecklistModel(value, checked) {
                var current = getter(scope.$parent);
                if (angular.isFunction(setter)) {
                    if (checked === true) {
                        setter(scope.$parent, add(current, value, comparator));
                    } else {
                        setter(scope.$parent, remove(current, value, comparator));
                    }
                }

            }

            // declare one function to be used for both $watch functions
            function setChecked(newArr, oldArr) {//jshint ignore:line
                if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                    setValueInChecklistModel(value, scope[attrs.ngModel]);
                    return;
                }
                scope[attrs.ngModel] = contains(newArr, value, comparator);
            }

            // watch original model change
            // use the faster $watchCollection method if it's available
            if (angular.isFunction(scope.$parent.$watchCollection)) {
                scope.$parent.$watchCollection(checklistModel, setChecked);
            } else {
                scope.$parent.$watch(checklistModel, setChecked, true);
            }
        }

        return {
            restrict: 'A',
            priority: 1000,
            terminal: true,
            scope: true,
            compile: function (tElement, tAttrs) {
                if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') &&
                    (tElement[0].tagName !== 'MD-CHECKBOX') && (!tAttrs.btnCheckbox)) {
                    throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
                }

                if (!tAttrs.checklistValue && !tAttrs.value) {
                    throw 'You should provide `value` or `checklist-value`.';
                }

                // by default ngModel is 'checked', so we set it if not specified
                if (!tAttrs.ngModel) {
                    // local scope var storing individual checkbox model
                    tAttrs.$set("ngModel", "checked");
                }

                return postLinkFn;
            }
        };
    }]);
})();
