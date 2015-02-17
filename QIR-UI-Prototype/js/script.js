
$(document).ready(function() {
   
   
   /* alernating rows different background color */
   var tableAlternate = function() {
       $('table tbody').find('tr:nth-child(even)').css('background-color', '#dfedfa');
   };
   
   var selectAlternate = function() {
        $('.custom-select .select-menu').find('li:nth-child(even)').css('background-color', '#f8f8f8');
   };
   
   tableAlternate();
   selectAlternate();
   
   
    /* clear functions */
    /* regular user and admin user home */
    $('.search-qir-buttons .clear-btn').on('click', function() {
        var clearSection = $(this).parent().siblings('.search-qir-content');
        clearFunction(clearSection);
    });
    
    /* manage pages */
    $('.manage-pages .buttons-row .clear-btn').on('click', function() {
        var clearSection = $(this).parent().find('.other-input');
        clearFunction(clearSection);
    });
    
   
    /* datepicker logic */
    $(".calendar input").datepicker({
        dateFormat:"mm/dd/yy" 
    });
    
    $(".calendar .calendar-icon").on("click", function() {
        $(this).siblings("input").trigger("click").focus();
    });
    
    
    /* custom select dropdown logic */
    $('.custom-select .select-menu').hide();
    $('body').on('click','.custom-select .select-box' ,function () {
        var head = $(this).siblings('.select-menu');
        var menuOpen = head.is(':visible');
        $('.custom-select .select-menu').hide();
        $('.custom-select .select-box').removeClass('selected');
        if (!menuOpen) {
            head.show();
            $(this).addClass('selected');
        }
    });
    
    $('body').on('click','.select-menu li' ,function() {
        var head = $(this).closest('.custom-select');
        var option = null;
        if(head.hasClass('menu2')) {
            option = $(this).find('.name').text();
        } else {
            option = $(this).text();
        }
        /* classification and root cause filter selects */
        if(head.closest('.filter').length) {
            if(option !== 'All') {
                head.parent().next().show();
            }
        }
        /* selective display of content in manage pages */
        if(head.closest('.manage-pages').length && head.closest('.select-trigger').length) {
            if(option ===' ') {
                head.closest('.manage-pages').find('.table-container').hide();
            } else {
                head.closest('.manage-pages').find('.table-container').show();
            }
        }
        head.find('.select-text').text(option);
        $(this).closest('.select-menu').hide();
        head.find('.select-box').removeClass('selected');
    });
    
    
    /* expand collapse sections logic */
    $('.collapsable-content').hide();
    $('.collapsable-row').on('click', function () {
        var slideContent = $(this).siblings('.collapsable-content');
        if (slideContent.is(':hidden')) {
            slideContent.show('blind');
            $(this).removeClass('collapsed');
        } else {
            slideContent.hide('blind').queue(function () {
                $(this).siblings('.collapsable-row').addClass('collapsed');
                $(this).dequeue();
            });
        }
    });
    
    
    /* checkbox logic */
    $('body').on('click','.check-icon, .check-lbl', function() {
        $(this).parent('.check-option').toggleClass('ticked', function() {
        });
    });
    
    
    /* radio buttons logic */
    $('body').on('click','.radio-icon, .radio-lbl', function() {
        $(this).closest('.radio-selection').find('.selected').removeClass('selected');
        $(this).parent('.radio-option').addClass('selected', function() {
            /* selective display in case of customer impact section */
            if($(this).closest('.impact-on-cust').length) {
                var optionText = $(this).find('.radio-lbl').text();
                impactSelectiveDisplay(optionText);
            }
        });
    });
    
    
    /* displaying selective fields in impact on customers section */
    var impactDefaultOption = $('.impact-on-cust .cust-impact .radio-option.selected .radio-lbl').text();
    
    impactSelectiveDisplay(impactDefaultOption);
    function impactSelectiveDisplay(option) {
        var head = $('.impact-on-cust .selective-content');
        if(option === 'Yes') {
            head.show();
            head.siblings('.cust-impact').removeClass('last');
        } else if(option === 'No') { 
            head.hide();
            head.siblings('.cust-impact').addClass('last');
        } else {
            return;
        }
    }
    
    
    /* root cause manage page node tree logic */
    $('.manage-root-cause-content').on('click', '.level-icon', function() {
        var head = $(this).parent().parent();
        if(head.hasClass('expanded')) {
            head.find('.expanded').each(function() {
                $(this).children('ul').children(':not(.root-node)').each(function() {
                    $(this).addClass('hide');
                });
                $(this).removeClass('expanded');
            });
            head.children('ul').children(':not(.root-node)').each(function() {
                $(this).addClass('hide');
            });
            head.removeClass('expanded');
        } else {
            head.addClass('expanded');
            head.children('ul').children().each(function() {
                $(this).removeClass('hide');
            });
        }
    });
    
    
    /* root cause manage popup */
    $('.manage-root-cause-content').on('click', '.root-node .node-name, .base-node .node-name', function() {
        var pos = $(this).offset();
        $('.manage-root-cause-content').find('.selected').removeClass('selected');
        $(this).parent().addClass('selected');
        var width = $(this).width();
        $("#manage-node-popup").show().css({"left" : pos.left+5+width, "top" : pos.top-110});
    });
    
    /* root cause manage popup functions */
    $('#manage-node-popup').on('click','li a', function() {
       var task = $(this).attr('class');
       var selNode = $('.manage-root-cause-content').find('.selected');
       $('#manage-node-popup').hide();
       selNode.removeClass('selected');
       var newNode = selNode.clone();
       var head = selNode.parent();
       var baseNode = $('.manage-root-cause-content').find('.base-node').first().clone();
       
       switch(task) {
           
            case 'duplicate-node' :
                if(selNode.hasClass('base-node')) {
                    newNode.insertAfter(selNode);
                } else {
                    newNode.removeClass('root-node').addClass('base-node').find('.level-icon').remove();
                    var temp = newNode;
                    newNode = head.clone().removeClass('expanded').empty();
                    newNode.append(temp);
                    newNode.insertAfter(head);
                }
                break;
                
            case 'duplicate-branch' :   
                if(selNode.hasClass('base-node')) {
                    newNode.insertAfter(selNode);
                } else {
                    newNode = head.clone();
                    head.after(newNode);
                    if(newNode.hasClass('expanded')) {
                        newNode.children('.root-node').children('.level-icon').trigger('click');
                    }
                }
                break;
            
            case 'move-up' :
                if(head.prev()) {
                    head.insertBefore(head.prev());
                }
                break;
                
            case 'move-down' :
                if(head.next()) {
                    head.insertAfter(head.next());
                }
                break;
                
            case 'indent' :
                break;
                
            case 'outdent' :
                break;
                
            case 'add-child' :
                if(selNode.hasClass('root-node')) {
                    if(!selNode.parent().hasClass('expanded')) {
                        selNode.children('.level-icon').trigger('click');
                    }
                    newNode = selNode.next().children('li').first().clone().empty().append(baseNode);
                    newNode.children('.base-node').children('.node-name').hide();
                    newNode.children('.base-node').append('<input type="text" value="Node Name"><a href="javascript:;" class="save-changes">Save</a>');
                    selNode.next().prepend(newNode);
                } else {
                    var newLevel = null;
                    head.filter(function() {
                        var classes = $(this).attr('class').split(' ');
                        for (var i=0; i<classes.length; i++)
                        {
                            if (classes[i].slice(0,5) === 'level')
                            {
                                newLevel = 'level'+ (++classes[i].split('level')[1]);
                                newNode = head.clone().removeClass(classes[i]).addClass(newLevel);
                                newLevel = ++classes[i].split('level')[1];
                                return true;
                            }
                        }
                    });
                    newNode.wrap("<ul class='sortable'></ul>");
                    newNode.children('.base-node').children('.node-name').hide();
                    newNode.children('.base-node').append('<input type="text" value="Node Name"><a href="javascript:;" class="save-changes">Save</a>');
                    selNode.removeClass('base-node').addClass('root-node').prepend('<span class="level-icon"></span>');
                    head.addClass('expanded').append(newNode.parent());
                    $('.sortable').sortable();
                    $('.manage-root-cause-content .level'+newLevel+' .base-node').css('margin-left', (newLevel-1)*22);
                    $('.manage-root-cause-content .level'+newLevel+' .root-node').css('margin-left', (newLevel-1)*22);
                }
                break;
                
            case 'add-sibling' :
                if(selNode.hasClass('base-node')) {
                    newNode = head.clone();
                } else {
                    newNode = head.clone().empty().append(baseNode).removeClass('expanded');
                }
                newNode.children('.base-node').children('.node-name').hide();
                newNode.children('.base-node').append('<input type="text" value="Node Name"><a href="javascript:;" class="save-changes">Save</a>');
                head.after(newNode);
                break;
                
            case 'edit-node' :
                var nodeName = selNode.children('.node-name').text();
                selNode.children('.node-name').hide();
                selNode.append('<input type="text" value="'+nodeName+'"><a href="javascript:;" class="save-changes">Save</a>');
                break;
            
            case 'delete-node' :
                head.remove();
       }
       
       
    });
    
    /* save changes button in tree actions */
    $('.manage-root-cause-content').on('click','.save-changes', function() {
        var nodeName = $(this).siblings('input').val();
        $(this).parent().find('.node-name').show().text(nodeName);
        $(this).siblings('input').remove();
        $(this).remove();
    });
    
    
    /* drag drop in root cause management page */
    $('.sortable').sortable();
    
    
    
    /* expand all collapse all in root cause manage page */
    $('#page-manage-root-cause .expand-all').on('click', function() {
        var head = $(this).closest('#main-content').find('.manage-root-cause-content');
        head.find('.root-node').each(function() {
           if(!$(this).parent().hasClass('expanded')) {
               $(this).children('.level-icon').trigger('click');
           } 
        });
    });
    $('#page-manage-root-cause .collapse-all').on('click', function() {
        var head = $(this).closest('#main-content').find('.manage-root-cause-content');
        head.children('ul').children('.expanded').each(function() {
            $(this).children('.root-node').children('.level-icon').trigger('click');
        });
    });
    
    
    
    /* expand all sections in report detail page logic */
    $('.expand-all').on('click', function() {
        var head = $(this).closest('.container').find('#main-content');
        head.find('.collapsable-row').removeClass('collapsed');
        head.find('.collapsable-content').show('blind');
    });
    
    
    /* collapse all sections in report detail page logic */
    $('.collapse-all').on('click', function() {
        var head = $(this).closest('.container').find('#main-content');
        head.find('.collapsable-content').each(function() {
            $(this).hide('blind').queue(function(){
                $(this).siblings('.collapsable-row').addClass('collapsed');
                $(this).dequeue();
            });
        });
    });
    
    
    
    /* toggle header fixed in QIR pages pin/unpin button */
    $('.pin-unpin-btn').on('click', function() {
        var head = $(this).closest('.container');
        if($(this).text() === 'Unpinned') {
            head.addClass('fixed-header');
            $(this).text('Pinned');
        } else {
            head.removeClass('fixed-header');
            $(this).text('Unpinned');
        }
        window.scrollTo(0, 0);
    });
    
    
    /* classification and root cause modals filters */
    $('.modal .filter .level2-select, .modal .filter .level3-select, .modal .filter .level4-select').hide();
    $('.modal .master-list .list-box li').on('click', function() {
        $(this).closest('.list-box').find('.selected').removeClass('selected');
        $(this).addClass('selected');
        /* classification details options popup */
        if($(this).closest('#classification-modal').length) {
            var pos = $(this).position();
            $('#classification-details-options').show().css({"left" : pos.left+50, "top" : pos.top});
        }
    });
    
    /* classfication details options functions */
    $('#classification-details-options li').on('click', function() {
        var head = $('#classification-modal .details .section-content');
        $('#classification-modal .details .section-content > div').hide();
        var option = $(this).attr('class');
        switch(option) {
            case 'option1': 
                head.find('.start-end-time-section, .purity-readings-section').show();
                break;
               
            case 'option2':
                head.find('.start-end-time-section').show();
                break;
                
            case 'option3':
                head.find('.batch-number-section').show();
                break;
                
            case 'option4':
                head.find('.lot-number-section').show();
                break;
                
            case 'option5':
                break;
        }
        $('#classification-details-options').hide();
    });
    
    
    
    
    /*modal windows */
    var currentZindex = 100;
    var modalLoad = function (selector) {
        var modal = $(selector);
        var overlay = '<div class="overlay" data-target="' + modal.attr('id') + '" style="z-index: ' + (++currentZindex) +  '"></div>';
        modal.css('z-index', ++currentZindex);
        $(overlay).insertAfter(modal);
        modalCenter(selector);
        modal.show();
        $(window).resize(function() { modalCenter(selector); });
        $(window).scroll(function() { modalCenter(selector); });
    };
    
    var modalCenter = function (selector) {
        var $modal = $(selector);
        var top, left;
        top = Math.max($(window).height() - $modal.height(), 0) / 2;
        left = Math.max($(window).width() - $modal.width(), 0) / 2;

        $modal.css({
            top: (top > 0) ? top + $(window).scrollTop(): 0, 
            left: left + $(window).scrollLeft()
        });
    };
    
    var modalReset = null;
    
    /* close btn in modal header */
    $('.modal .close-btn').on("click", function() {
        $(this).parents('.modal').hide();
        $('.overlay[data-target="'+ $(this).parents('.modal').attr('id') +'"]').remove();
    });
    
    /* add new template modal */
    $('.add-new-tmplt-btn').on('click', function() {
        modalLoad('#add-template-modal');
        modalReset = $('#add-template-modal').children().clone(true); 
    });
    
    /* edit template modal */
    $('#page-email-templates .table-container table .edit-icon').on('click', function() {
        modalLoad('#edit-template-modal');
        modalReset = $('#edit-template-modal').children().clone(true);
    });
    
    /* view department notification recipient list modal*/
    $('.view-noti-list-btn').on('click', function() {
        modalLoad('#view-noti-list-modal');
        modalReset = $('#view-noti-list-modal').children().clone(true);
    });
    
    /* root caise modal */
    $('.root-cause-btn, .root-cause-det-btn').on('click', function() {
        modalLoad('#root-cause-modal');
        modalReset = $('#root-cause-modal').children().clone(true);
    });
    
    /* classification modal */
    $('.classification-btn').on('click', function() {
        modalLoad('#classification-modal');
        modalReset = $('#classification-modal').children().clone(true);
    });
    
    /* add to my working QIR modal*/
    $('.add-to-my-qir-btn').on('click', function() {
        modalLoad('#add-to-qir-confirmation-modal');
        modalReset = $('#add-to-qir-confirmation-modal').children().clone(true);
    });
    
    /* reopened confirmation modal */
    $('.reopen-btn').on('click', function() {
        modalLoad('#reopened-confirmation-modal');
        modalReset = $('#reopened-confirmation-modal').children().clone(true);
    });
    
    /* submit approval confirmation modal */
    $('.submit-approval-btn, .approve-btn').on('click', function() {
        modalLoad('#approval-confirmation-modal');
        modalReset = $('#approval-confirmation-modal').children().clone(true);
    });
    
    /* delete QIR from table confirmation modal */
    $('#page-admin-user-home .table-container .right-scrollable .delete-icon').on('click', function() {
        modalLoad('#delete-qir-confirmation-modal');
        modalReset = $('#delete-qir-confirmation-modal').children().clone(true);
    });
    $('#delete-qir-confirmation-modal .yes-btn').on('click', function() {
        $(this).closest('.modal').find('.modal-content p').text('QIR Deleted');
        $(this).parent().empty().append("<a href='javascript:;' class='btn right ok-confirm-btn'><span class='btn-text'>OK</span><span class='btn-icon right'></span></a>");
    });
    
    /* reject modal */
    $('.reject-btn').on('click', function() {
        modalLoad('#reject-modal');
        modalReset = $('#reject-modal').children().clone(true);
    });
    /*rejected confirmation modal */
    $('#reject-modal').on('click', '.reject-btn', function() {
        $('#reject-modal .close-btn').trigger('click');
        modalLoad('#reject-confirmation-modal');
        modalReset = $('#reject-confirmation-modal').children().clone(true);
    });
    
    /* delete role from dept noti table */
    $('#page-manage-dept-noti .table-container table').on('click','.delete-icon', function() {
        modalLoad('#delete-role-confirmation-modal');
        modalReset = $('#delete-role-confirmation-modal').children().clone(true);
    });
    $('#delete-role-confirmation-modal .yes-btn').on('click', function() {
        $(this).closest('.modal').find('.modal-content p').text('Role Deleted');
        $(this).parent().empty().append("<a href='javascript:;' class='btn right ok-confirm-btn'><span class='btn-text'>OK</span><span class='btn-icon right'></span></a>");
    });
    
    $('.modal').on('click', '.cancel-btn, .no-btn, .edit-tmplt-btn, .add-tmplt-btn, .save-btn, .ok-confirm-btn', function() {
        $(this).closest('.modal').empty().append(modalReset).find('.close-btn').trigger('click');
    });
    
    
    
    /* demo report detail links popup for both admin and regular user */
    $(document).on('click','.report-detail-link', function() {
        var pos = $(this).offset();
        $("#report-detail-demo-links").show().css({"left" : pos.left+34, "top" : pos.top-8});
    });

    
    
    /* active tab for QIR table */
    $('.qir-section .tabs li').on('click', function() {
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');
    });
    
    
    
    /* edit table rows in manage pages*/
    $('.manage-pages table').find('.cancel-icon, .save-icon').hide();
    $('.manage-pages table').on('click','.edit-icon' ,function() {
        $(this).siblings().show();
        $(this).hide();
    });
    $('.manage-pages table').on('click','.cancel-icon, .save-icon' ,function() {
        var head = $(this).closest('tr');
        head.find('.cancel-icon, .save-icon').hide();
        head.find('.edit-icon').show();
    });
    
    /* manage codes page */
    $('#page-manage-codes .manage-pages table').on('click', '.edit-icon', function() {
        var index = $(this).closest('tr').index();
        var textArray = [index+1,"Code Name", "Code"];
        var head = $(this).closest('tr');
        var tempHead = head.find('td:eq(1)');
        for(var i=2; i<5; i++) {
            tempHead.html('<input type="text" value="'+textArray[i-2]+'">').css('padding', '0 3px');
            tempHead = head.find('td:eq('+i+')');
        }
        tempHead.html("<div class='check-option'><span class='check-icon'></span></div>");
    });
    $('#page-manage-codes .manage-pages table').on('click', '.save-icon, .cancel-icon', function() {
        var index = $(this).closest('tr').index();
        var textArray = [index+1,"Code Name", "Code", "No"];
        var head = $(this).closest('tr');
        var tempHead = null;
        for(var i=1; i<5; i++) {
            tempHead = head.find('td:eq('+i+')');
            tempHead.empty().text(textArray[i-1]);
        }
    });
    
    /* manage Dept Regions page */
    $('#page-manage-dept-regions .manage-pages table').on('click', '.edit-icon', function() {
        var head = $(this).closest('tr');
        var tempHead = head.find('td:eq(1)');
        tempHead.html('<input type="text" value="Region Name">').css('padding', '0 3px');
        tempHead = head.find('td:eq(2)').css('overflow', 'visible');
        var outerHtml = $('<div class="custom-select"></div>');
        outerHtml.append('<div class="select-box"><span class="select-text ">Code Name</span><span class="select-arrow-icon right"></span></div>');
        outerHtml.append('<div class="select-menu"><ul><li> </li><li>Code Name</li><li>Code Name</li><li>Code Name</li><li>Code Name</li></ul></div>');
        outerHtml.find('.select-menu').hide();
        tempHead.empty().append(outerHtml).css('padding', '0 3px');
        selectAlternate();
        tempHead = head.find('td:eq(3)');
        tempHead.html("<div class='check-option'><span class='check-icon'></span></div>");
    });
    $('#page-manage-dept-regions .manage-pages table').on('click', '.save-icon, .cancel-icon', function() {
        var textArray = ["Region Name", "Code Name", "No"];
        var head = $(this).closest('tr');
        var tempHead = null;
        for(var i=1; i<4; i++) {
            tempHead = head.find('td:eq('+i+')');
            tempHead.empty().text(textArray[i-1]);
        }
    });
    
    $('#page-manage-dept-noti .manage-pages table').on('click', '.edit-icon', function() {
        var head = $(this).closest('tr');
        var tempHead = head.find('td:eq(1)').css('overflow', 'visible');
        var outerHtml = $('<div class="custom-select"></div>');
        outerHtml.append('<div class="select-box"><span class="select-text ">Role Name</span><span class="select-arrow-icon right"></span></div>');
        outerHtml.append('<div class="select-menu"><ul><li> </li><li>Role Name</li><li>Role Name</li><li>Role Name</li><li>Role Name</li></ul></div>');
        outerHtml.find('.select-menu').hide();
        tempHead.html(outerHtml).css('padding', '0 3px');
        selectAlternate();
        tempHead = head.find('td:eq(2)').css('padding', '0 3px');
        tempHead.html('<div class="search-box"><input type="text" value="Username"><a href="javascript:;"></a></div>');
    });
    $('#page-manage-dept-noti .manage-pages table').on('click', '.save-icon, .cancel-icon', function() {
        var textArray = ["Role Name", "Username"];
        var head = $(this).closest('tr');
        var tempHead = null;
        for(var i=1; i<3; i++) {
            tempHead = head.find('td:eq('+i+')');
            tempHead.empty().text(textArray[i-1]);
        }
    });
    
    
    /* sort filter popup */
    /* filter pop-up pisitioning */
    var sortReset = null;
    var curSortIcon = null;
    $('table thead .sort-icon').on('click', function() {
        curSortIcon = $(this);
        var pos = $(this).closest('th').offset();
        if(sortReset === null) {
            $('#sort-filter').show().css({"left" : pos.left, "top" : pos.top+42});
        } else  if(pos.left === $('#sort-filter').position().left) {
            $('#sort-filter').hide();
        } else {
            $('#sort-filter').show().css({"left" : pos.left, "top" : pos.top+42});
            $('#sort-filter').empty().append(sortReset);
        }
        sortReset = $('#sort-filter').children().clone(true);
    });
    
    /* filter cancel button */
    $('#sort-filter .cancel-btn').on('click', function() {
        $(this).closest('#sort-filter').empty().append(sortReset).hide();
        sortReset = null;
    });
    
    /* ok filter button */
    $('#sort-filter .ok-filter-btn').on('click', function() {
        $(this).closest('#sort-filter').empty().append(sortReset).hide();
        curSortIcon.addClass('filtered');
        sortReset = null;
    });
    
    /* sort choice tick untick */
    $('#sort-filter .filter-options .selected-icon').hide();
    $('#sort-filter .filter-options').on('click', '.small-to-large, .large-to-small', function() {
        $(this).closest('.filter-options').find('.selected-icon').hide();
        $(this).find('.selected-icon').show();
    });
    
    /* select/unselect all button */
    $('#sort-filter .check-all-icon').on('click', function() {
        var head = $(this).closest('#sort-filter').find('.filter-options .filter-checks');
        if($(this).hasClass('select-all')) {
            head.find('.check-option').each(function() {
                $(this).removeClass('ticked');
            });
        } else {
            head.find('.check-option').each(function() {
                $(this).addClass('ticked');
            });
        }
        $(this).toggleClass('select-all');
    });
    
    
    
    /* pagination logic*/
    /* change the show per page number */
    $('.pagination .select-num select').change(function() {
        var perPageNew = 0;
        if($('option:selected', this).text() === 'All') {
            perPageNew = 50;
        } else {
            perPageNew = parseInt($('option:selected', this).text(), 10);
        }
        var head = $(this).closest('.table-container');
        head.find('.pagination select').val(perPageNew);
        head.find('.start-num').text(1);
        head.find('.end-num').text(perPageNew);
        var temp = perPageNew;
        head.find('table').each(function() {
            perPageNew = temp;
            var tableBody = $(this).find('tbody');
            var rows = tableBody.find('tr:lt(5)').clone().css('background-color', '#ffffff');
            tableBody.empty();
            while(perPageNew > 0) {
                tableBody.append(rows);
                rows = tableBody.find('tr:lt(5)').clone().css('background-color', '#ffffff');
                perPageNew = perPageNew - 5;
            }
        });
        tableAlternate();
    });
    
    /* prev next buttons */
    $('.pagination .prev-link').on('click', function() {
        var head = $(this).closest('.table-container');
        var startNum = parseInt(head.find('.start-num:first').text(), 10);
        var endNum = parseInt(head.find('.end-num:first').text(), 10);
        head.find('.next-link').removeClass('disabled');
        if(startNum === 1) {
            return;
        } else {
            var perPage = parseInt(head.find('.select-num select:first :selected').text(), 10);
            startNum = startNum - perPage;
            endNum = endNum - perPage;
            if(startNum ===1) {
                head.find('.prev-link').addClass('disabled');
            }
            head.find('.start-num').text(startNum);
            head.find('.end-num').text(endNum);
        }
    });
    $('.pagination .next-link').on('click', function() {
        var head = $(this).closest('.table-container');
        var startNum = parseInt(head.find('.start-num:first').text(), 10);
        var endNum = parseInt(head.find('.end-num:first').text(), 10);
        var totNum = parseInt(head.find('.total-num:first').text(), 10);
        head.find('.prev-link').removeClass('disabled');
        if(endNum === totNum) {
            $(this).addClass('disabled');
            return;
        } else {
            var perPage = parseInt(head.find('.select-num select:first :selected').text(), 10);
            startNum = startNum + perPage;
            endNum = endNum + perPage;
            if(endNum ===totNum) {
                head.find('.next-link').addClass('disabled');
            }
            head.find('.start-num').text(startNum);
            head.find('.end-num').text(endNum);
        }
    });
    
    
    /* body click functions */
    $("body").on('mousedown', function (e) {
        var caseNo = 0;
        if ($(e.target).is('#report-detail-demo-links, #report-detail-demo-links *, .report-detail-link')) {
            caseNo = 1;
        }
        if ($(e.target).is('.custom-select .select-box, .custom-select .select-box *, .custom-select .select-menu, .custom-select .select-menu *')) {
            caseNo = 2;
        }
        if($(e.target).is('#sort-filter *, #sort-filter, table thead .sort-icon ')) {
            caseNo = 3;
        }
        
        if($(e.target).is('#manage-node-popup, #manage-node-popup *, .manage-root-cause-content .node-name')) {
            caseNo = 4;
        }
        
        switch(caseNo) {
            case 1 :
                $(".custom-select .select-menu").hide();
                $('.custom-select .select-box').removeClass('selected');
                $('#sort-filter').hide();
                break;
            
            case 2 :
                $("#report-detail-demo-links").hide();
                $('#sort-filter').hide();
                break;
            
            case 3 :
                $(".custom-select .select-menu").hide();
                $('.custom-select .select-box').removeClass('selected');
                $("#report-detail-demo-links").hide();
                break;
               
            case 4 :
                break;
                
            case 0 : 
                $(".custom-select .select-menu").hide();
                $('.custom-select .select-box').removeClass('selected');
                $("#report-detail-demo-links").hide();
                $('#sort-filter').hide();
                $('#manage-node-popup').hide();
                $('.manage-root-cause-content').find('.selected').removeClass('selected');
        }
    });
    
    
    function clearFunction(clearSection) {
        clearSection.find('input').val('');
        clearSection.find('.custom-select .select-menu ul li:first-child').trigger('click');
        clearSection.find('.check-option').removeClass('ticked');
    }
    
});