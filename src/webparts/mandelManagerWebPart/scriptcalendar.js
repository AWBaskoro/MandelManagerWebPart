var moment = require('moment');
require('./en-au');
require('./tooltip');
require('./en-au');
var popover=require('./popover');


// var PATH_TO_DISPFORM = window.webAbsoluteUrl + "/Lists/Schedule/DispForm.aspx";
// var TASK_LIST = "Schedule";
// var COLORS = ['#466365', '#B49A67', '#93B7BE', '#E07A5F', '#849483', '#084C61', '#DB3A34'];

var arr_events = [
  {
    id: '1',
    title: 'office 365 training',
    resourceId: 'a',
    start: '2018-09-11',
    end: '2018-09-13',
    status:'Uncompleted',
   
  },
  {
    id: '2',
    title: 'Sharepoint 2016 Training',
    resourceId: 'b',
    start: '2018-09-15',
    end: '2018-09-17',
    status:'completed',
    color:'#849483'
  },
  {
    id: '3',
    title: 'Dynamics 365 Training',
    resourceId: 'd',
    start: '2018-09-19',
    end: '2018-09-23',
    status:'OnProgress',
    color:'#DB3A34'
  }
]

var arr_resources = [
    {
      id: 'a',
      trainer: 'John Doe',
      title:'Xamarin'
    },
    {
      id: 'b',
      trainer: 'John Doe',
      title:'Biztalk'
    },

    {
      id: 'c',
      trainer: 'Vesa Juvonen',
      title:'Sharepoint 2016 Branding'
    },
    {
      id: 'd',
      trainer: 'Vesa Juvonen',
      title:'Dynamics CRM 365'
    },

    {
      id: 'e',
      trainer: 'Vesa Juvonen',
      title:'Sharepoint Framework'
    },
    {
      id: 'f',
      trainer: 'Mahesh Chand',
      title:'Angular 6'
    }
  ];

  var popTemplate = [
    '<div class="popover" style="max-width:600px;" >',
    '<div class="arrow"></div>',
    '<div class="popover-header">',
    '<button id="closepopover" type="button" class="close" aria-hidden="true">&times;</button>',
    '<h3 class="popover-title"></h3>',
    '</div>',
    '<div class="popover-content"></div>',
    '</div>'].join('');

   var popoverElement;
    displayTasks();
   
  

  $('body').on('click', function (e) {
    // close the popover if: click outside of the popover || click on the close button of the popover
    if (popoverElement && ((!popoverElement.is(e.target) && popoverElement.has(e.target).length === 0 && $('.popover').has(e.target).length === 0) || (popoverElement.has(e.target) && e.target.id === 'closepopover'))) {
        closePopovers();
    }
  });

  window.AddNewEvent=function(){
    var evt_name=$('.popover-content').find('#tbEvent').val();
     var trnr_name=$('.popover-content').find('#tbTrainer').val();
     var sDate= $('label[for = start_date]').text();
     var eDate= $('label[for = end_date]').text();
    alert('selected '+sDate+' to '+eDate+' '+ evt_name +' - '+trnr_name);
    return false;
  }
  
  module.exports={
    AddNewEvent:AddNewEvent
  };

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate()-1),
        year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return [year, month, day].join('-');
  }

  function closePopovers() {
    $('.popover').not(this).popover('hide');
  }

  function displayTasks() {
    
    $('#calendar').fullCalendar({
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      selectable:true,
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'customWeek,customMonth'
      },
      slotWidth:30,
      views: {
        customWeek: {
          type: 'timeline',
          duration: { weeks: 1 },
          slotDuration: {days: 1},
          buttonText: 'Week'
      },
      customMonth: {
        type: 'timeline',
        duration: { months: 1 },
        slotDuration: {days: 1},
        buttonText: 'Month'
    }
      },
      
      eventRender: function(eventObj, $el, view) {
        $el.popover({
          title: eventObj.title,
          content: function () {
            $('label[for = pop_startDate]').text(eventObj.start.format());
            $('label[for = pop_endDate]').text(eventObj.end.add(-1, 'days').format());
            var qryResource=$("#calendar").fullCalendar("getResourceById",eventObj.resourceId);
            $('label[for = pop_trainer]').text(qryResource.trainer);
            $('label[for = pop_subject]').text(qryResource.title);
            return $("#popInfo").html();
        },
          trigger: 'hover',
          placement: 'top',
          html:true,
          container: 'body'
        });
      },
     
      slotLabelFormat: [
        'D'
      ],
      resourceGroupField: 'trainer',
      // open up the display form when a user clicks on an event
      eventClick: function (calEvent, jsEvent, view) {

      },
      
      select: function(startDate, endDate, jsEvent, view, resource) {
       closePopovers();
        popoverElement=$(jsEvent.target);
        $(jsEvent.target).popover({
          title:'Add Event',
          content: function () {
            $('label[for = start_date]').text(startDate.format());
            $('#AddEvt').find('input[id=tbTrainer]').attr('value', resource.title);
            $('label[for = end_date]').text(endDate.add(-1, 'days').format());
            return $("#AddEvt").html();
        },
        template:popTemplate,
        placement:'bottom',
        html:'true',
        trigger:'click',
        container:'body'
  
        }).popover('show');
      },
      editable: true,
    
      droppable: true, // this allows things to be dropped onto the calendar
      // update the end date when a user drags and drops an event 
      eventDrop: function (event, delta, revertFunc) {
        updateTask(event.id, event.start, event.end, event.title);
      },
      // put the events on the calendar 
      events: arr_events,
      resources:arr_resources,
      defaultView:'customMonth',
      resourceLabelText: 'Trainer',
    });
  }

  function updateTask(id, startDate, dueDate, title) {
    //subtract the previously added day to the date to store correct date
    var sDate = moment.utc(startDate).format('YYYY-MM-DD');
    //+ "T" +
    //startDate.format("hh:mm") + ":00Z";
    if (!dueDate) {
      dueDate = startDate;
    }
    var dDate = moment.utc(dueDate).add("-1", "days").format('YYYY-MM-DD') + "T" +
      dueDate.format("hh:mm") + ":00Z";
  
    var idx = $.map(arr_tasks, function (obj, index) {
      if (obj.id == id) {
        return index;
      }
  
    });
  
    
    arr_tasks.splice(idx,1);
    var objtask=new Object();
    objtask.id=id;
    objtask.title=title;
    objtask.start=sDate;
    objtask.end=dDate;
    arr_tasks.push(objtask);
  
    displayTasks();
  }