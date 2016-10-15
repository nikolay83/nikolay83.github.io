$(function() {
    angular.module('app.core')
        .directive('pageScript', scriptBlock);

    function scriptBlock() {
        return {
            restrict: 'A',
            link: function() {
                // similar to sprintf in C++
                var sprintf = function(str) {
                    var args = arguments,
                        flag = true,
                        i = 1;

                    str = str.replace(/%s/g, function() {
                        var arg = args[i++];

                        if (typeof arg === 'undefined') {
                            flag = false;
                            return '';
                        }
                        return arg;
                    });
                    return flag ? str : '';
                };


                // Table sorting function
                $('table th.sort').on('click', function() {
                    if ($(this).hasClass('sort-asc')) {
                        $(this).removeClass('sort-asc').addClass('sort-desc');
                    } else if ($(this).hasClass('sort-desc')) {
                        $(this).removeClass('sort-desc').addClass('sort-asc');
                    } else {
                        $(this).parents('thead').find('.sort-asc').removeClass('sort-asc');
                        $(this).parents('thead').find('.sort-desc').removeClass('sort-desc');
                        $(this).addClass('sort-desc');
                    }
                });

                // Pagination function
                $('body').on('click', '.pagination a.item', function() {
                    var paginate = $(this).parents('.pagination');
                    paginate.find('.current').removeClass('current');
                    $(this).addClass('current');
                    if ($(this).hasClass('first')) {
                        paginate.find('.prev').addClass('hide');
                        paginate.find('.next').removeClass('hide');
                    } else if ($(this).hasClass('last')) {
                        paginate.find('.prev').removeClass('hide');
                        paginate.find('.next').addClass('hide');
                    } else {
                        paginate.find('.prev').removeClass('hide');
                        paginate.find('.next').removeClass('hide');
                    }
                });
                // Pagination prev
                $('body').on('click', '.pagination a.prev', function() {
                    var paginate = $(this).parents('.pagination');
                    var current = paginate.find('.current');
                    current.removeClass('current');
                    var prev = current.prev();
                    if (prev.hasClass('more')) {
                        $('<a class="item" href="javascript:;">6</a><a class="item" href="javascript:;">7</a>').insertBefore(prev);
                        prev = prev.prev();
                        prev.next().remove();
                    }
                    prev.addClass('current');
                    if (prev.hasClass('first')) {
                        paginate.find('.prev').addClass('hide');
                        paginate.find('.next').removeClass('hide');
                    } else if (prev.hasClass('last')) {
                        paginate.find('.prev').removeClass('hide');
                        paginate.find('.next').addClass('hide');
                    } else {
                        paginate.find('.prev').removeClass('hide');
                        paginate.find('.next').removeClass('hide');
                    }
                });

                // Pagination next click
                $('body').on('click', '.pagination a.next', function() {
                    var paginate = $(this).parents('.pagination');
                    var current = paginate.find('.current');
                    current.removeClass('current');
                    var next = current.next();
                    if (next.hasClass('more')) {
                        $('<a class="item" href="javascript:;">6</a><a class="item" href="javascript:;">7</a>').insertAfter(next);
                        next = next.next();
                        next.prev().remove();
                    }
                    next.addClass('current');
                    if (next.hasClass('first')) {
                        paginate.find('.prev').addClass('hide');
                        paginate.find('.next').removeClass('hide');
                    } else if (next.hasClass('last')) {
                        paginate.find('.prev').removeClass('hide');
                        paginate.find('.next').addClass('hide');
                    } else {
                        paginate.find('.prev').removeClass('hide');
                        paginate.find('.next').removeClass('hide');
                    }
                });

                // Change style after select something
                $('select.has-default').on('change', function() {
                    $(this).removeClass('has-default');
                });
                // Add assessment businiss info
                if ($('#bu-risk').length) {
                    $('.bu-risk').on('change', function() {
                        var empty = false;
                        $('.bu-risk').each(function(index, item) {
                            if (!$(item).val().length) {
                                empty = true;
                                return;
                            }
                        });
                        if (empty) {
                            $('#bu-risk').addClass('hide');
                        } else {
                            $('#bu-risk').removeClass('hide');
                        }
                    });
                }

                // Handle the total for add-assessment-business-unit-info.html
                if ($('select#sites-select').length) {
                    $('select#sites-select').multipleSelect({
                        selectAll: false,
                        minimumCountSelected: 0,
                        onClose: function() {
                            var selects = $('select#sites-select').multipleSelect('getSelects');
                            var len = selects.length;
                            if (len) {
                                $('#sites-info').removeClass('hide');
                                //$('#sites-select').parent().parent().addClass('hide');
                                $('.sites-element').addClass('hide');
                                for (var i = 0; i < len; ++i) {
                                    $('.sites-element#' + selects[i]).removeClass('hide');
                                }
                            }

                            $('.sites-element.hide select').val("0");
                            $('.sites-element select').trigger('change');
                        }
                    });

                    $('.sites-element select').on('change', function() {
                        var sum = 0;
                        $('.sites-element select').each(function() {
                            sum += parseInt($(this).val());
                        });
                        if (sum !== 100) {
                            $('#total').addClass('error');
                            $('#total').html(sum + '% (The total should be 100%)');
                        } else {
                            $('#total').removeClass('error');
                            $('#total').html(sum + '%');
                        }
                    });
                }

                // Date picker related
                $('.date-input').datepicker({
                    format: 'dd-mm-yyyy',
                    todayHighlight: true
                });
                $('.datepicker table').append('<tfoot><tr><th colspan="7" style="background: #798B9A; width: 100%; height: 29px; line-height: 29px; border-radius: 0; ">' +
                    '<a href="javascript:;" style="color: #FFF; width: 100%;" class="fl ok-btn">OK</a></th></tr></tfoot>');
                $('.ok-btn').on('click', function() {
                    $('.datepicker').hide();
                });

                /* add-assessment-prior.html */
                $('.cmn-toggle').on('change', function() {
                    if ($(this).prop('checked')) {
                        $(this).parents('.toggle-header').find('.add-btn').show();
                        $(this).parents('.toggle-container').find('.toggle-content').removeClass('hide');
                        $(this).next().removeClass('unchecked');
                    } else {
                        $(this).parents('.toggle-header').find('.add-btn').hide();
                        $(this).parents('.toggle-container').find('.toggle-content').addClass('hide');
                        $(this).next().addClass('unchecked');
                    }
                });
                $('.cmn-toggle').change();

                // toggle content function
                $('body').on('click', '.toggle-content .element .remove-link', function() {
                    $(this).parents('.element').remove();
                    assignNumbers();
                });

                // add-assessment-prior.html add function
                var elementHtml = '<div class="element">\
                            <div class="row m-t-20">\
                                <span class="change-number"></span>\
                            </div>\
                            <div class="row m-t-20">\
                                <label>Change Type</label>\
                                <select id="select-element-%s" class="middle m-t-15 multiple" multiple="multiple" name="single">\
                                    <option value="process">Process</option>\
                                    <option value="compliance">Compliance Requirements</option>\
                                    <option value="controls">Controls</option>\
                                    <option value="systems">Systems</option>\
                                    <option value="outsourcing">Outsourcing</option>\
                                    <option value="organizational">Organizational Structure</option>\
                                    <option value="roles">Roles & Responsibilities</option>\
                                </select>\
                            </div>\
                            <div class="m-t-30 row">\
                                <label class="calendar-title">{{calendar-title}}</label>\
                                <div class="date-wrapper">\
                                    <input type="text" class="date-input"/>\
                                    <i class="date-icon"></i>\
                                </div>\
                            </div>\
                            <div class="m-t-30 row">\
                                <label>Description of change</label>\
                            <textarea class="description-change-textarea"></textarea>\
                            </div>\
                            <a href="javascript:;" class="remove-link"><span class="icon-remove"></span> Remove</a>\
                        </div>';

                function assignNumbers() {
                    var counter = 1;
                    $('.toggle-container.prior-changes .toggle-content .element').each(function() {
                        $('span.change-number', $(this)).text('#' + counter);
                        counter++;
                    });

                    counter = 1;
                    $('.toggle-container.anticipated-changes .toggle-content .element').each(function() {
                        $('span.change-number', $(this)).text('#' + counter);
                        counter++;
                    });
                }

                var cntElement = 0;

                $('.toggle-header .add-btn').on('click', function() {
                    var toggleContainer = $(this).parents('.toggle-container');
                    ++cntElement;
                    if (toggleContainer.hasClass('prior-changes')) {
                        toggleContainer.find('.toggle-content').append(sprintf(elementHtml, cntElement.toString()).replace('{{calendar-title}}', 'When did the change take place?'));
                    } else {
                        toggleContainer.find('.toggle-content').append(sprintf(elementHtml, cntElement.toString()).replace('{{calendar-title}}', 'When do you anticipate the change taking place?'));
                    }
                    $('#select-element-' + cntElement.toString()).multipleSelect("Refresh");
                    assignNumbers();

                    $('.date-input').datepicker({
                        dayViewHeaderFormat: 'MMMM - YYYY',
                        format: 'dd-mm-yyyy',
                        todayHighlight: true
                    });

                    $('.datepicker table').each(function() {
                        if (!$(this).find('.ok-btn').length) {
                            $(this).append('<tfoot><tr><th colspan="7" style="background: #798B9A; width: 100%; height: 29px; line-height: 29px; border-radius: 0; ">' +
                                '<a href="javascript:;" style="color: #FFF; width: 100%;" class="fl ok-btn">OK</a></th></tr></tfoot>');
                            $(this).find('.ok-btn').on('click', function() {
                                $('.datepicker').hide();
                            });
                        }
                    });
                });

                // Multiple select function
                $('select.control-select').on('change', function() {
                    if ($(this).val()) {
                        //$(this).parents('td').nextAll().children().not('select.multiple').not('.hide').show();
                        $(this).parents('tr').show();
                    } else {
                        //$(this).parents('td').nextAll().children().not('select.multiple').hide();
                        $(this).parents('tr').hide();
                    }
                });

                //show reasons drop down in KCM
                $('.KCM-control').change(function() {


                    if (this.value === 'AcceptableRisk' || this.value === 'UnacceptableRisk' || this.value === 'Unsatisfactory') {
                        $(this).parent().children('select').css('display', 'block');
                    } else {
                        $(this).parent().children('.hide').hide();
                    }

                });

                // Collapsable content
                $('.expand-head a').on('click', function(e) {
                    e.stopPropagation();
                });
                $('.expand-head').on('click', function() {
                    if ($(this).hasClass('closed')) {
                        $(this).removeClass('closed');
                    } else {
                        $(this).addClass('closed');
                    }
                    $(this).next().toggleClass('closed');
                });

                // Tab function
                $('.tab-navigate a').on('click', function() {
                    var id = $(this).attr('href');
                    $('.tabpane .tab.active').removeClass('ctKPI');
                    $('.tabpane .tab.active').removeClass('active');
                    $(id).addClass('active');
                    $(id).addClass('ctKPI');
                    $('.tab-navigate a.active').removeClass('ctKPI');
                    $('.tab-navigate a.active').removeClass('active');
                    $(this).addClass('ctKPI');
                    $(this).addClass('active');
                    $(window).resize();
                    return false;
                });

                $('.date-icon').on('click', function() {
                    $(this).prev().focus();
                });

                // Mock search function
                $('.btn-search').on('click', function() {
                    $('.result-container').hide();
                    $('.loading').removeClass('hide');
                    setTimeout(function() {
                        $('.result-container').show();
                        $('.loading').addClass('hide');
                    }, 3000);
                });

                $('.select-ok').on('click', function() {
                    //$(this).parents('.ms-drop').hide();
                    $('body').click();
                });

                // Tips for multiple select and inputs
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
                window.setTimeout(function() {
                    $('.multiple').hover(function() {
                        var selects = $(this).parent().find('select').multipleSelect('getSelects', 'text');
                        var html = '';
                        if (selects.length) {
                            html = '<ul>';
                            for (var i = 0; i < selects.length; ++i) {
                                html += '<li>' + selects[i] + '</li>';
                            }
                            html += '</ul>';
                        } else {
                            html = 'Nothing selected';
                        }
                        showTip($(this), html);
                    }, function() {
                        $('#tips').hide();
                    });
                }, 10);

                //table header tooltip
                $('.custom-table th').hover(function() {
                    //    html = "Lorem ipsum dolor sit amet";
                    //    showTip($(this), html);

                }, function() {
                    //    $('#tips').hide();
                });

                $('input[type=radio]').each(function() {
                    var label = $(this).parents('label');
                    var title = label.attr('title');
                    if (title) {
                        label.data("title", $(this).attr("title")).removeAttr("title");
                        label.on('mouseenter', function() {
                            showTip($(this), title, true);
                        });
                        label.on('mouseleave', function() {
                            $('#tips').hide();
                        });
                    }
                });

                // Fix table header when scroll to top
                $.fn.fixMe = function() {
                    return this.each(function() {
                        var $this = $(this),
                            $t_fixed;

                        function init() {
                            $this.wrap('<div class="row" />');
                            $t_fixed = $this.clone();
                            $t_fixed.find("tbody").remove().end().addClass("fix-header").insertBefore($this);
                            resizeFixed();
                        }

                        function resizeFixed() {
                            $t_fixed.find("th").each(function(index) {
                                $(this).css("width", $this.find("th").eq(index).outerWidth() + "px");
                            });
                            $t_fixed.width($this.width());
                            $t_fixed.hide();
                        }

                        function scrollFixed() {
                            var offset = $(this).scrollTop(),
                                tableOffsetTop = $this.offset().top,
                                tableOffsetBottom = tableOffsetTop + $this.height() - $this.find("thead").height();
                            if (offset < tableOffsetTop || offset > tableOffsetBottom)
                                $t_fixed.hide();
                            else if (offset >= tableOffsetTop && offset <= tableOffsetBottom && $t_fixed.is(":hidden"))
                                $t_fixed.show();
                        }
                        $(window).resize(resizeFixed);
                        $(window).scroll(scrollFixed);
                        init();
                    });
                };
                $("table.custom-table").fixMe();

                // add-assessment-processes-corporate.html
                $('#corporate-control').on('change', function() {
                    var selects = $(this).multipleSelect('getSelects');
                    if (selects.length) {
                        $('.separate-row').removeClass('hide');
                    } else {
                        $('.separate-row').addClass('hide');
                    }
                    $('.control-rows').addClass('hide');
                    for (var i = 0; i < selects.length; ++i) {
                        $('#' + selects[i]).removeClass('hide');
                    }
                });

                // "Overall Risk Rating Commentary" at add-assessment-overall.html
                $('#overall-textarea').attr('disabled', true);
                $('#overall-switch').click(function() {
                    if ($('#overall-textarea').attr('disabled')) {
                        $('#overall-textarea').attr('disabled', false);
                        $('#overall-switch').text('Save');
                    } else {
                        $('#overall-textarea').attr('disabled', true);
                        $('#overall-switch').text('Edit');
                    }
                });

                // Check whether all fields are completed at add-assessment-overall.html
                $('#submit-for-review1, #submit-for-review2').on('click', function() {
                    $('.incompleted.content').addClass('hide');
                    $('Product').removeClass('error');
                    $('Department').removeClass('error');
                    $('Department-Lead').removeClass('error');
                    $('Bu-Risk-Management-Approval').removeClass('error');
                    $('Divisional-Risk-ManngeMent-Approval').removeClass('error');
                    $('Annual-Analysis').removeClass('error');
                    $('Assessment-Status').removeClass('error');
                    $('Assessment-Due-Date').removeClass('error');
                    $('Functional-Area-Owner').removeClass('error');
                    $('Individual-Completing-Assessment').removeClass('error');
                    $('Functional-Area').removeClass('error');
                    $('#change-date-1').removeClass('error');
                    $('#change-date-2').removeClass('error');
                    var incompleted = false;
                    if ($('#Product').text() === 'Select') {
                        incompleted = true;
                        $('#Product').addClass('error');
                    }
                    if ($('#Department').text() === 'Select') {
                        incompleted = true;
                        $('#Department').addClass('error');
                    }
                    if ($('#Department-Lead').text() === 'Select') {
                        incompleted = true;
                        $('#Department-Lead').addClass('error');
                    }
                    if ($('#Bu-Risk-Management-Approval').text() === 'Select') {
                        incompleted = true;
                        $('#Bu-Risk-Management-Approval').addClass('error');
                    }
                    if ($('#Divisional-Risk-ManngeMent-Approval').text() === 'Select') {
                        incompleted = true;
                        $('#Divisional-Risk-ManngeMent-Approval').addClass('error');
                    }
                    if ($('#Annual-Analysis').text() === 'Select') {
                        incompleted = true;
                        $('#Annual-Analysis').addClass('error');
                    }
                    if ($('#Assessment-Status').text() === 'Select') {
                        incompleted = true;
                        $('#Assessment-Status').addClass('error');
                    }
                    if ($('#Assessment-Due-Date').text() === 'Select') {
                        incompleted = true;
                        $('#Assessment-Due-Date').addClass('error');
                    }
                    if ($('#Functional-Area-Owner').text() === 'Select') {
                        incompleted = true;
                        $('#Functional-Area-Owner').addClass('error');
                    }
                    if ($('#Individual-Completing-Assessment').text() === 'Select') {
                        incompleted = true;
                        $('#Individual-Completing-Assessment').addClass('error');
                    }
                    if ($('#Functional-Area').text() === 'Select') {
                        incompleted = true;
                        $('#Functional-Area').addClass('error');
                    }
                    if ($('#Total-percentage').text() !== '100%') {
                        incompleted = true;
                        $('#Total-percentage').addClass('error');
                    }
                    if ($('#change-date-1').text() === '00-MM-0000') {
                        incompleted = true;
                        $('#change-date-1').addClass('error');
                    }
                    if ($('#change-date-2').text() === '00-MM-0000') {
                        incompleted = true;
                        $('#change-date-2').addClass('error');
                    }
                    if (incompleted)
                        $('.incompleted.content').removeClass('hide');
                    else
                        window.location.href = 'manage.html';
                });
                // disapproval assessment
                $('#disapprove-btn1, #disapprove-btn2').on('click', function() {
                    $('#disapprove-reason-popup').dialog({
                        resizable: false,
                        height: 300,
                        modal: true,
                        dialogClass: "no-close"
                    });
                });

                // submit reason for disapproved
                $('body').off('click', '#disapprove-submit').on('click', '#disapprove-submit', function() {
                    $('#disapprove-reason-popup').dialog('close').dialog('destroy');
                    window.location.href = '#/approver/awaiting';
                });

                $('body').off('click', '#disapprove-cancel').on('click', '#disapprove-cancel', function() {
                    $('#disapprove-reason-popup').dialog('close');
                });

                // ----------------------------------------------------------------------------------------------
                // additional processes in
                //     add-assessment-processes-business.html
                //     add-assessment-processes-corporate.html
                //     add-assessment-processes-data.html
                //     add-assessment-processes-information.html
                //     add-assessment-processes-records.html

                // return html of new additional process
                var newAdditionalProcess = function(idInAll, isStriped) {
                    return sprintf(
                        '<tr class="last %s">\
                 <td><textarea class="short ext-textarea" maxlength="500" name="additional-process" placeholder="Additional"></textarea></td>\
                 <!--risk -->\
                 <td><textarea class="short ext-textarea" maxlength="500" name="additional-risk" placeholder="Additional"></textarea></td>\
                 <!-- Risk exposure -->\
                 <td class="align-at-center risk-answer">\
                     <label title="Low"><input name="risk-exposure-%s" type="radio" name="risk-answer"/> L</label>\
                     <label title="Medium"><input name="risk-exposure-%s" type="radio" name="risk-answer"/> M</label>\
                     <label title="High"><input name="risk-exposure-%s" type="radio" name="risk-answer"/> H</label>\
                 </td>\
                 <!-- controls -->\
                 <td>\
                     <select class="ultra-short multiple" name="controls" multiple="multiple">\
                         <option value="IEX">IEX (Avaya Workforce Management)</option>\
                         <option value="AIQ">AIQ (Avaya Reporting)</option>\
                         <option value="Sales">Sales Force Reporting</option>\
                         <option value="notplace">Not in place</option>\
                         <option value="other">Other</option>\
                     </select>\
                 </td>\
                 <td colspan="4"></td>\
             </tr>',
                        isStriped ? 'striped' : '',
                        idInAll, idInAll, idInAll
                    );
                };

                // add additional rows for additional-process
                var updateAprocesses = function() {
                    var last = $('tr.last textarea[name="additional-process"]');
                    if (last.val()) {
                        var row = last.parent().parent();
                        setupHandlers(
                            row
                            .removeClass('last')
                            .parent() /* tbody */
                            .append(
                                newAdditionalProcess($('select[name="controls"]').length + 1, !row.hasClass('striped'))
                            )
                            .find('tr:last') /* tr */
                        );
                    }
                };

                // ----------------------------------------------------------------------------------------------
                // controls handling in
                //     add-assessment-processes-business.html
                //     add-assessment-processes-corporate.html
                //     add-assessment-processes-data.html
                //     add-assessment-processes-functional.html
                //     add-assessment-processes-information.html
                //     add-assessment-processes-records.html

                var controlFrequencyHtml = '<!-- Control Frequency-->\
        <td class="control">\
            <select class="ultra-short multiple" multiple="multiple" name="single">\
                <option value="adhoc">Adhoc</option>\
                <option value="Daily">Daily</option>\
                <option value="Weekly">Weekly</option>\
                <option value="Monthly">Monthly</option>\
                <option value="Quarterly">Quarterly</option>\
                <option value="Annual">Annual</option>\
            </select>\
        </td>';
                var controlDesignHtml = '<!-- Control Design -->\
        <td class="control">\
            <select class="ultra-short multiple" multiple="multiple">\
                <option value="automated">Automated</option>\
                <option value="ITDependent">IT Dependent</option>\
                <option value="ManualPrevention">Manual Prevention</option>\
                <option value="ManualDetect">Manual Detect</option>\
            </select>\
        </td>';
                var testingFrequencyHtml = '<!-- Testing & Frequency -->\
        <td class="control">\
            <select class="ultra-short multiple testing-frequency" multiple="multiple">\
                <option value="Within BU D">Within BU - Daily</option>\
                <option value="Within BU M">Within BU – Monthly</option>\
                <option value="Within BU Q">Within BU – Quarterly</option>\
                <option value="Within BU SA">Within BU – Semi-Annual</option>\
                <option value="Within BU A">Within BU – Annual</option>\
                <option value="Outside of BU M">Outside of BU – Monthly</option>\
                <option value="Outside of BU Q">Outside of BU – Quarterly</option>\
                <option value="Outside of BU SA">Outside of BU – Semi-Annual</option>\
                <option value="Outside of BU A">Outside of BU – Annual</option>\
                <option value="Outside of BU GA">Outside of BU - Greater than Annual</option>\
                <option value="Third Party A">Third Party - Annual</option>\
                <option value="Third Party GA">Third Party - Greater than Annual</option>\
                <option value="nottested">Not Tested</option>\
            </select>\
        </td>';
                var controlTriggerHtml = '<!-- Control Trigger -->\
        <td class="control control-trigger">\
            <select class="ultra-short multiple" multiple="multiple">\
                <option value="Performance">Performance</option>\
                <option value="Process">Process</option>\
                <option value="Product">Product</option>\
                <option value="Regulatory">Regulatory/Compliance</option>\
                <option value="SOX/MAR">SOX/MAR</option>\
                <option value="38a-1">38a-1</option>\
                <option value="SOC 1">SOC 1</option>\
                <option value="SOC 2">SOC 2</option>\
                <option value="other">Other</option>\
            </select>\
        </td>';
                var keyControlsHtml = '<!-- Key Controls -->\
        <td class="control key-controls">\
            <select class="ultra-short multiple key-controls" multiple="multiple" name="single">\
                <option value="Optimized">Optimized</option>\
                <option value="Satisfactory">Satisfactory</option>\
                <option value="AcceptableRisk">Needs Improvement/Acceptable Risk</option>\
                <option value="UnacceptableRisk">Needs Improvement/Unacceptable Risk</option>\
                <option value="Unsatisfactory">Unsatisfactory</option>\
            </select>\
        </td>';
                var advancedControlHtml = '\
        <td colspan="2"></td>\
        <td colspan="4" class="control-name">%s</td>\
        <!-- Controls objective-->\
        <td class="control">\
            <input type="text" class="ultra-short"/>\
        </td>';
                var simpleControlHtml = '\
        <td colspan="2"></td>\
        <td colspan="2" class="control-name">%s</td>';

                var advancedNotInPlaceHtml = '\
        <td colspan="2"></td>\
        <td colspan="4" class="control-name not-in-place">%s</td>\
        <td colspan="6"></td>';
                var simpleNotInPlaceHtml = '\
        <td colspan="2"></td>\
        <td colspan="2" class="control-name not-in-place">%s</td>\
        <td colspan="4"></td>';

                // html of new control
                var newControl = function(name, isStriped, notInPlace, isSimple) {
                    return sprintf(
                        '<tr class="subrow%s">' + (
                            notInPlace ?
                            (
                                isSimple ? simpleNotInPlaceHtml : advancedNotInPlaceHtml
                            ) : (
                                isSimple ?
                                (
                                    simpleControlHtml + controlFrequencyHtml + controlDesignHtml + testingFrequencyHtml + keyControlsHtml
                                ) : (
                                    advancedControlHtml + controlFrequencyHtml + controlDesignHtml + testingFrequencyHtml + controlTriggerHtml + keyControlsHtml
                                )
                            )
                        ) + '</tr>',
                        isStriped ? ' striped' : '',
                        name
                    );
                };

                // adjust controls
                var updateControls = function() {
                    $('select[name="controls"]').each(function() {
                        var activeControls = $(this).data('activeControls') || {};
                        var hiddenControls = $(this).data('hiddenControls') || {};
                        var controllerRow = $(this).parent().parent();
                        var isSimple = controllerRow.parents('.controlls-simple').length;
                        var controllerCell = (
                            controllerRow.hasClass('subrow') ? controllerRow.prevAll('tr:not(.subrow):first') : controllerRow
                        ).find('td:first');
                        var rowspan = parseInt(controllerCell.attr('rowspan')) || 1;
                        var selectedControls = {};
                        var selected = $(this).multipleSelect('myGetSelects');
                        for (var k = 0; k < selected.length; k += 2) {
                            selectedControls[selected[k]] = selected[k + 1];
                        }
                        /* if "Not in place" seected then it shouldn’t allow you to select other options */
                        if (selectedControls['notplace'] && !$(this).data('notplace')) {
                            /* "Not in place" is selected and was not selected before */
                            $(this)
                                .data('notplace', true)
                                .multipleSelect('setSelects', ['notplace']);
                            selectedControls = {
                                'notplace': selectedControls['notplace']
                            };
                        } else if (selectedControls['notplace'] && 2 < selected.length && $(this).data('notplace')) {
                            /* anything besides "Not in place" is selected and "Not in place" was selected before */
                            var excludeNotInPlace = {};
                            selected = [];
                            for (var selectedValue in selectedControls) {
                                if ('notplace' != selectedValue) {
                                    excludeNotInPlace[selectedValue] = selectedControls[selectedValue];
                                    selected.push(selectedValue);
                                }
                            }
                            $(this)
                                .data('notplace', false)
                                .multipleSelect('setSelects', selected);
                            selectedControls = excludeNotInPlace;
                        } else if (!selectedControls['notplace']) {
                            $(this).data('notplace', false);
                        }
                        /* check selected controls */
                        for (var selectedValue in selectedControls) {
                            var selectedText = selectedControls[selectedValue];
                            selectedControls[selectedValue] = true;
                            var row;
                            if (row = hiddenControls[selectedValue]) {
                                if (row.hasClass('hide')) {
                                    // selected control is hidden - show it
                                    row.removeClass('hide');
                                    rowspan++;
                                }
                                hiddenControls[selectedValue] = undefined;
                                activeControls[selectedValue] = row;
                            } else if (!(row = activeControls[selectedValue])) {
                                // add new control
                                row = newControl(selectedText, controllerRow.hasClass('striped'), 'notplace' == selectedValue, isSimple);
                                var target = controllerRow.next();
                                if (target.length) {
                                    row = $(row).insertBefore(target);
                                } else {
                                    row = controllerRow.parent().append(row).find('tr:last');
                                }
                                setupHandlers(row);
                                rowspan++;
                                activeControls[selectedValue] = row;
                            } else if ('other' == selectedValue) {
                                row.find('.control-name')
                                    .css('text-align', 'left')
                                    .text(selectedText);
                            }
                        }
                        /* check activated controls */
                        for (var activeValue in activeControls) {
                            var row;
                            if ((row = activeControls[activeValue]) && !selectedControls[activeValue]) {
                                // active control no longer selected - hide it
                                if (!row.hasClass('hide')) {
                                    row.addClass('hide');
                                    rowspan--;
                                }
                                activeControls[activeValue] = undefined;
                                hiddenControls[activeValue] = row;
                            }
                        }
                        /* correct rowspan for "Core Process" column if needed */
                        if (!isSimple) {
                            if (1 > rowspan) {
                                rowspan = 1;
                            }
                            controllerCell.attr('rowspan', rowspan);
                        }
                        $(this).data('activeControls', activeControls);
                        $(this).data('hiddenControls', hiddenControls);
                    });
                };


                // ----------------------------------------------------------------------------------------------
                // additional category and KPI in
                //     add-assessment-processes.html

                // return html of new additional category
                var newAdditionalCategory = function(isStriped) {
                    return sprintf(
                        '<tr class="last%s">\
                 <td class="tc"><textarea class="short ext-textarea" maxlength="500" name="additional-category" placeholder="Additional"></textarea></td>\
                 <td class="tc"><textarea class="short ext-textarea" maxlength="500" name="additional-KPI" placeholder="Additional"></textarea></td>\
                 <td class="tc"><textarea class="short ext-textarea" maxlength="500" name="additional-SLA" placeholder="Additional"></textarea></td>\
             </tr>',
                        isStriped ? ' striped' : ''
                    );
                };

                // return html of new additional KPI
                var newAdditionalKpi = function(isStriped) {
                    return sprintf(
                        '<tr class="subrow last%s">\
                 <td class="tc"><textarea class="short ext-textarea" maxlength="500" name="additional-KPI" placeholder="Additional"></textarea></td>\
                 <td class="tc"><textarea class="short ext-textarea" maxlength="500" name="additional-SLA" placeholder="Additional"></textarea></td>\
             </tr>',
                        isStriped ? ' striped' : ''
                    );
                };

                // add additional rows for additional category and KPI
                var updateAkpi = function() {
                    var last = $('tr:last textarea[name="additional-category"]');
                    if (last.val()) {
                        var core = last.parent().parent(); /* tr */
                        setupHandlers(
                            core.parent() /* tbody */
                            .append(
                                newAdditionalCategory(!core.hasClass('striped'))
                            )
                            .find('tr:last') /* tr */
                        );
                    }
                    $('tr.last textarea[name="additional-KPI"]').each(function() {
                        if ($(this).val()) {
                            var core = $(this)
                                .parent().parent() /* tr */
                                .removeClass('last');
                            setupHandlers(
                                $(newAdditionalKpi(core.hasClass('striped'))).insertBefore(core.next())
                            );
                            if (core.hasClass('subrow')) {
                                core = core.prevAll('tr:not(.subrow):first');
                            }
                            core.find('td:first').each(function() {
                                var cnt = parseInt($(this).attr('rowspan'));
                                cnt = (cnt || 1) + 1;
                                $(this).attr('rowspan', cnt);
                            });
                        }
                    });
                };

                // ----------------------------------------------------------------------------------------------
                // additional core and sub-processes in
                //     add-assessment-processes-functional.html

                var coreSubProcessControlsHtml =
                    '<td class="sub-process"><textarea class="alittle-short ext-textarea" maxlength="500" name="additional-sub-process" placeholder="Additional"></textarea></td>\
         <!--risk -->\
         <td><textarea class="alittle-short ext-textarea" maxlength="500" name="additional-risk" placeholder="Additional"></textarea></td>\
         <!-- likelihood of occurrence -->\
         <td>\
             <select class="ultra-short multiple likelihood-of-occurrence" multiple="multiple" name="single">\
                 <option value="Daily">Daily</option>\
                 <option value="Monthly">Monthly</option>\
                 <option value="Quarterly">Quarterly</option>\
                 <option value="Semi-Annual">Semi-Annual</option>\
                 <option value="Annual">Annual</option>\
                 <option value="notapplicable">Process is no longer applicable</option>\
             </select>\
         </td>\
         <!--Risk Impact-->\
         <td>\
             <select class="ultra-short multiple risk-impact" multiple="multiple">\
                 <option value="Financial">Financial</option>\
                 <option value="Operational">Operational</option>\
                 <option value="Regulatory">Regulatory</option>\
                 <option value="Reputational">Reputational</option>\
                 <option value="NA">NA</option>\
             </select>\
         </td>\
         <!-- Risk exposure -->\
         <td class="align-at-center risk-answer">\
             <label title="Low"><input type="radio" name="risk-answer-%s"/> L</label>\
             <label title="Medium"><input type="radio" name="risk-answer-%s"/> M</label>\
             <label title="High"><input type="radio" name="risk-answer-%s"/> H</label>\
         </td>\
         <!-- controls -->\
         <td>\
             <select name="controls" class="ultra-short multiple" multiple="multiple">\
                 <option value="IEX">IEX (Avaya Workforce Management)</option>\
                 <option value="AIQ">AIQ (Avaya Reporting)</option>\
                 <option value="Sales">Sales Force Reporting</option>\
                 <option value="notplace">Not in place</option>\
                 <option value="other">Other</option>\
             </select>\
         </td>\
         <td colspan="6"></td>';

                // return html of new additional core of sub-process
                var newAdditionalCoreSubProcess = function(isStriped, idInAll) {
                    return sprintf(
                        '<tr class="additional last%s">\
                 <td><textarea class="alittle-short ext-textarea" maxlength="500" name="additional-core-process" placeholder="Additional"></textarea></td>\
                 ' + coreSubProcessControlsHtml + '\
             </tr>',
                        isStriped ? ' striped"' : '',
                        idInAll, idInAll, idInAll
                    );
                };

                // return html of new additional sub-process
                var newAdditionalSubProcess = function(isStriped, idInAll) {
                    return sprintf(
                        '<tr class="subrow additional last%s">\
                 ' + coreSubProcessControlsHtml + '\
             </tr>',
                        isStriped ? ' striped' : '',
                        idInAll, idInAll, idInAll, idInAll
                    );
                };

                // add additional rows for additional core- and sub-processes
                var updateASubProcesses = function() {
                    $('tr:last textarea[name="additional-core-process"]').each(function() {
                        if ($(this).val()) {
                            var core = $(this).parent().parent();
                            setupHandlers(
                                core.parent() /* tbody */
                                .append(
                                    newAdditionalCoreSubProcess(!core.hasClass('striped'), $('select[name="controls"]').length + 1)
                                )
                                .find('tr:last') /* tr */
                            );
                        }
                    });
                    $('tr.last textarea[name="additional-sub-process"]').each(function() {
                        if ($(this).val()) {
                            var core = $(this)
                                .parent().parent() /* tr */
                                .removeClass('last');
                            var row = newAdditionalSubProcess(core.hasClass('striped'), $('select[name="controls"]').length + 1); /* tr */
                            var target = core.nextAll('tr:not(.subrow):first');
                            if (target.length) {
                                row = $(row).insertBefore(target);
                            } else {
                                row = core.parent().append(row).find('tr:last');
                            }
                            if (core.hasClass('subrow')) {
                                core = core.prevAll('tr:not(.subrow):first');
                            }
                            core.find('td:first').each(function() {
                                var cnt = parseInt($(this).attr('rowspan'));
                                cnt = (cnt || 1) + 1;
                                $(this).attr('rowspan', cnt);
                            });
                            setupHandlers(row);
                        }
                    });
                };

                // ----------------------------------------------------------------------------------------------
                // main event handling loop

                $(document).on('click keyup paste', function() {
                    updateAkpi();
                    updateAprocesses();
                    updateControls();
                    updateASubProcesses();
                    // dropdowns style fix
                    $('.ms-parent:not(.ms-parent-button-checked):has(li.selected)').addClass('ms-parent-button-checked');
                    $('.ms-parent.ms-parent-button-checked:not(:has(li.selected))').removeClass('ms-parent-button-checked');
                });

                $(document).ready(function() {
                    setupHandlers($(document));
                });


                // ----------------------------------------------------------------------------------------------
                // handling dropdowns choices

                var commentReturnElement, commentReturnOption;

                // submit comment for selecting "no"
                $('#comment-submit').on('click', function() {
                    // post data to backend before closing
                    // ...
                    var c = commentReturnElement.data('comments');
                    c[commentReturnOption] = $('#comment-content').val();
                    commentReturnElement.data('comments', c);
                    $('#comment-popup').dialog('close');
                    return false;
                });

                // get comments for saying "No"
                function getComment(def) {
                    def = def || '';
                    $('#comment-content').val(def);
                    $('#comment-popup').dialog({
                        resizable: false,
                        height: 300,
                        modal: true,
                        dialogClass: 'no-close'
                    });
                };

                function checkChoiceValue(select, checked, value) {
                    // comment dialogs
                    if (select.hasClass('likelihood-of-occurrence')) {
                        var applicable = false;
                        if (checked && 'notapplicable' == value) {
                            commentReturnElement = select;
                            commentReturnOption = value;
                            getComment(select.data('comments')[value]);
                        } else {
                            var selected = select.multipleSelect('myGetSelects');
                            for (var k = 0; k < selected.length; k += 2) {
                                if ('notapplicable' != selected[k]) {
                                    applicable = true;
                                    break;
                                }
                            }
                        }
                        select.parent().parent().toggleClass('likelihood-of-occurrence-applicable', applicable);
                        if (!applicable) {
                            select.parent().parent()
                                .removeClass('likelihood-of-occurrence-applicable')
                                .find('select[name=controls]').multipleSelect('setSelects', []);
                            updateControls();
                        } else {
                            select.parent().parent()
                                .addClass('likelihood-of-occurrence-applicable');
                        }
                    } else if (select.hasClass('key-controls')) {
                        if (checked) {
                            switch (value) {
                                case 'notapplicable':
                                case 'AcceptableRisk':
                                case 'UnacceptableRisk':
                                case 'Unsatisfactory':
                                    commentReturnElement = select;
                                    commentReturnOption = value;
                                    getComment(select.data('comments')[value]);
                                    break;
                            }
                        }
                    } else if (select.hasClass('testing-frequency')) {
                        if (checked && "nottested" == value) {
                            commentReturnElement = select;
                            commentReturnOption = value;
                            getComment(select.data('comments')[value]);
                        }
                    }
                    // radio options in multi-selects
                    var multiSelectsRadios = {
                        'risk-impact': 'NA',
                        'testing-frequency': 'nottested'
                    };
                    for (var className in multiSelectsRadios) {
                        var radioOption = multiSelectsRadios[className];
                        multiSelectsRadios[className] = false;
                        if (select.hasClass(className)) {
                            /* if radio option is selected then it shouldn’t allow you to select other options */
                            var selectedControls = {};
                            var selected = select.multipleSelect('myGetSelects');
                            for (var k = 0; k < selected.length; k += 2) {
                                selectedControls[selected[k]] = selected[k + 1];
                            }
                            if (selectedControls[radioOption] && !select.data(radioOption)) {
                                /* radio option is selected and was not selected before */
                                select
                                    .data(radioOption, true)
                                    .multipleSelect('setSelects', [radioOption]);
                                multiSelectsRadios[className] = true;
                            } else if (selectedControls[radioOption] && 2 < selected.length && select.data(radioOption)) {
                                /* anything besides radio option is selected and "NA" was selected before */
                                selected = [];
                                for (var selectedValue in selectedControls) {
                                    if (radioOption != selectedValue) {
                                        selected.push(selectedValue);
                                    }
                                }
                                select
                                    .data(radioOption, false)
                                    .multipleSelect('setSelects', selected);
                            } else if (!selectedControls[radioOption]) {
                                select.data(radioOption, false);
                            }
                        }
                    }
                    if (select.hasClass('risk-impact')) {
                        if (multiSelectsRadios['risk-impact']) {
                            // If "NA" is selected in "Risk impact" column, it should disable all of the other controls for the rest of the steps from being able to be selected
                            select.parent().parent()
                                .addClass('risk-impact-NA')
                                .find('select[name=controls]').multipleSelect('setSelects', []);
                            updateControls();
                        } else {
                            select.parent().parent().removeClass('risk-impact-NA');
                        }
                    }
                }

                // ----------------------------------------------------------------------------------------------
                // setup custom elements and handlers

                function setupHandlers(parent) {
                    // setup dropdowns
                    parent
                        .find([
                            'select.multiple.likelihood-of-occurrence',
                            'select.multiple.key-controls',
                            'select.multiple.risk-impact',
                            'select.multiple.testing-frequency'
                        ].join(','))
                        .each(function() {
                            var select = $(this);
                            select.data('comments', {});
                            select.multipleSelect({
                                onClick: function(choice) {
                                    checkChoiceValue(select, choice.checked, choice.value);
                                }
                            });
                        });
                    parent
                        .find('select.multiple')
                        .multipleSelect({
                            selectAll: false,
                            minimumCountSelected: 0
                        });
                    parent
                        .find('select[multiple="multiple"]')
                        .multipleSelect('Refresh');
                    // grow textarea when it's too short
                    $('textarea[name*="additional"]:not(.autogrow)').each(function() {
                        $(this).addClass('autogrow');
                        var mirrorCounter = parseInt($(document.body).data('mirrorCounter')) || 0;
                        var mirrorId = 'autogrow-textarea-mirror-' + (++mirrorCounter).toString();
                        $(this).after(sprintf('<div id="%s"></div>', mirrorId));
                        mirrorId = '#' + mirrorId;
                        $(document.body).data('mirrorCounter', mirrorCounter);
                        var mirror = $(mirrorId)
                            .css({
                                'position': 'absolute',
                                'visibility': 'hidden',
                                'display': 'block',
                                'word-wrap': 'break-word',
                                'white-space': 'normal',
                                'padding': $(this).css('padding-top') + ' ' + $(this).css('padding-right') + ' ' + $(this).css('padding-bottom') + ' ' + $(this).css('padding-left'),
                                'font-family': $(this).css('font-family'),
                                'font-size': $(this).css('font-size'),
                                'font-weight': $(this).css('font-weight'),
                                'line-height': $(this).css('line-height'),
                                'letter-spacing': $(this).css('letter-spacing')
                            });
                        $(this)
                            .data('mirror', mirror)
                            .css('overflow', 'hidden')
                            .on('click keyup paste', function() {
                                var mirror = $(this).data('mirror');
                                mirror.width($(this).width());
                                mirror.html($(this).val()
                                    .replace(/&/g, '&amp;')
                                    .replace(/"/g, '&quot;')
                                    .replace(/'/g, '&apos;')
                                    .replace(/</g, '&lt;')
                                    .replace(/\>/g, '&gt;')
                                    .replace(/ /g, '&nbsp;')
                                    .replace(/\n/g, '<br />') + '&nbsp;&nbsp;&nbsp;'
                                );
                                $(this).height(mirror.height());
                            });
                    });
                }
            }
        }
    }

});
