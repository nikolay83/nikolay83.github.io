(function(angular) {
  'use strict';
  
  angular.module('heritage').controller('NotificationCtrl', NotificationCtrl);
  
  
  function NotificationCtrl() {
    var notifCtrl = this;
    
    notifCtrl.opened = false;
    notifCtrl.notifications = [
      {
        type: 'mail',
        from: 'Andy Grey',
        summary: 'Hi, do you already reabcd efgh',
        date: new Date(2014, 9, 13, 21, 45),
        read: false
      },
      {
        type: 'mail',
        from: 'Andy Grey',
        summary: 'Hi, do you already reabcd efgh',
        date: new Date(2014, 9, 13, 14, 45),
        read: false
      },
      {
        type: 'mail',
        from: 'Andy Grey',
        summary: 'Hi, do you already reabcd efgh',
        date: new Date(2014, 9, 13, 10, 0),
        read: false
      },
      {
        type: 'task',
        from: 'Outstanding Task',
        summary: 'Lorem Ipsum Task',
        date: new Date(2014, 9, 12, 21, 45),
        read: false
      },
      {
        type: 'mail',
        from: 'Rose Wiliams',
        summary: 'Please check new Task',
        date: new Date(2014, 9, 12, 9, 45),
        read: true
      },
      {
        type: 'mail',
        from: 'Andy Grey',
        summary: 'Hi, do you already reabcd efgh',
        date: new Date(2014, 9, 12, 9, 45),
        read: false
      },
      {
        type: 'mail',
        from: 'Andy Grey',
        summary: 'Hi, do you already reabcd efgh',
        date: new Date(2014, 9, 12, 9, 45),
        read: false
      },
      {
        type: 'mail',
        from: 'Andy Grey',
        summary: 'Hi, do you already reabcd efgh',
        date: new Date(2014, 9, 13, 9, 45),
        read: false
      }
      
    ];
    
  }
  
}(window.angular));