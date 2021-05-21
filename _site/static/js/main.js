const DAYS = 60 * 60 * 24 * 1000;

$(function() {

  try {
    var local_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    $('.local-timezone').text(local_timezone.toString());
  }
  catch(err) {
    $('.local-timezone-hide').hide();
  }

  deadlineByConf = {};

  
  
  
  var rawDeadlines = "2021-06-25 17:59:59" || [];
  if (rawDeadlines.constructor !== Array) {
    rawDeadlines = [rawDeadlines];
  }
  var parsedDeadlines = [];
  while (rawDeadlines.length > 0) {
    var rawDeadline = rawDeadlines.pop();
    // check if date is template
    if (rawDeadline.indexOf('%m') >= 0) {
      for (var m = 1; m <= 12; m++) {
        rawDeadlines.push(rawDeadline.replace('%m', m < 10 ? '0' + m : m));
      }
    } else if (rawDeadline.indexOf('%y') >= 0) {
      year = parseInt(moment().year());
      rawDeadlines.push(rawDeadline.replace('%y', year));
      rawDeadlines.push(rawDeadline.replace('%y', year + 1));

    } else {
      // adjust date according to deadline timezone
      
      var deadline = moment.tz(rawDeadline, "America/New_York");
      

      // post-process date
      if (deadline.minutes() === 0) {
        deadline.subtract(1, 'seconds');
      }
      if (deadline.minutes() === 59) {
        deadline.seconds(59);
      }
      parsedDeadlines.push(deadline);
    }
  }
 
  // get abstract deadline
  
    
        var abstractDeadline = moment.tz("2021-06-18 17:59:59", "America/New_York");
      
      // post-process date
    if (abstractDeadline.minutes() === 0) {
      abstractDeadline.subtract(1, 'seconds');
    }
    if (abstractDeadline.minutes() === 59) {
      abstractDeadline.seconds(59);
    }
    $('#hotnets2021 .abstract-deadline-time').html("Abstract deadline: " + abstractDeadline.local().format('D MMM YYYY, h:mm:ss a'));
  


  // check which deadline is closest
  var confDeadline = parsedDeadlines[0];
  var today = moment();
  var confCycleNum = 1; 
  for (var i = 1; i < parsedDeadlines.length; i++) {
    deadlineCandidate = parsedDeadlines[i];
    if ((today.diff(deadlineCandidate) < 0 && today.diff(deadlineCandidate) > today.diff(confDeadline))) {
      confDeadline = deadlineCandidate;
      //$('#hotnets2021 .iteration').html(`Review cycle ${confCycleNum} of ${parsedDeadlines.length}.`);
    }
  }

  // render countdown timer
  if (confDeadline) {
    function make_update_countdown_fn(confDeadline) {
      return function(event) {
        diff = moment() - confDeadline
        if (diff <= 0) {
           $(this).html(event.strftime('%D days %Hh %Mm %Ss'));
            if (diff > -1 * DAYS) {
              $('#hotnets2021 .timer').addClass('day_away');
            } else if (diff > -7 * DAYS) {
              $('#hotnets2021 .timer').addClass('week_away');
            }
        } else {
          $(this).html(confDeadline.fromNow());
        }
      }
    }
    $('#hotnets2021 .timer').countdown(confDeadline.toDate(), make_update_countdown_fn(confDeadline));
    // check if date has passed, add 'past' class to it
    if (moment() - confDeadline > 0) {
      $('#hotnets2021').addClass('past');
    }
    $('#hotnets2021 .deadline-time').html(confDeadline.local().format('D MMM YYYY, h:mm:ss a'));
    deadlineByConf["hotnets2021"] = confDeadline;
  }
  
  
  
  
  var rawDeadlines = "2021-06-28 23:59" || [];
  if (rawDeadlines.constructor !== Array) {
    rawDeadlines = [rawDeadlines];
  }
  var parsedDeadlines = [];
  while (rawDeadlines.length > 0) {
    var rawDeadline = rawDeadlines.pop();
    // check if date is template
    if (rawDeadline.indexOf('%m') >= 0) {
      for (var m = 1; m <= 12; m++) {
        rawDeadlines.push(rawDeadline.replace('%m', m < 10 ? '0' + m : m));
      }
    } else if (rawDeadline.indexOf('%y') >= 0) {
      year = parseInt(moment().year());
      rawDeadlines.push(rawDeadline.replace('%y', year));
      rawDeadlines.push(rawDeadline.replace('%y', year + 1));

    } else {
      // adjust date according to deadline timezone
      
      var deadline = moment.tz(rawDeadline, "Europe/Zurich");
      

      // post-process date
      if (deadline.minutes() === 0) {
        deadline.subtract(1, 'seconds');
      }
      if (deadline.minutes() === 59) {
        deadline.seconds(59);
      }
      parsedDeadlines.push(deadline);
    }
  }
 
  // get abstract deadline
  
    
        var abstractDeadline = moment.tz("2021-06-21 23:59", "Europe/Zurich");
      
      // post-process date
    if (abstractDeadline.minutes() === 0) {
      abstractDeadline.subtract(1, 'seconds');
    }
    if (abstractDeadline.minutes() === 59) {
      abstractDeadline.seconds(59);
    }
    $('#conext2021 .abstract-deadline-time').html("Abstract deadline: " + abstractDeadline.local().format('D MMM YYYY, h:mm:ss a'));
  


  // check which deadline is closest
  var confDeadline = parsedDeadlines[0];
  var today = moment();
  var confCycleNum = 1; 
  for (var i = 1; i < parsedDeadlines.length; i++) {
    deadlineCandidate = parsedDeadlines[i];
    if ((today.diff(deadlineCandidate) < 0 && today.diff(deadlineCandidate) > today.diff(confDeadline))) {
      confDeadline = deadlineCandidate;
      //$('#conext2021 .iteration').html(`Review cycle ${confCycleNum} of ${parsedDeadlines.length}.`);
    }
  }

  // render countdown timer
  if (confDeadline) {
    function make_update_countdown_fn(confDeadline) {
      return function(event) {
        diff = moment() - confDeadline
        if (diff <= 0) {
           $(this).html(event.strftime('%D days %Hh %Mm %Ss'));
            if (diff > -1 * DAYS) {
              $('#conext2021 .timer').addClass('day_away');
            } else if (diff > -7 * DAYS) {
              $('#conext2021 .timer').addClass('week_away');
            }
        } else {
          $(this).html(confDeadline.fromNow());
        }
      }
    }
    $('#conext2021 .timer').countdown(confDeadline.toDate(), make_update_countdown_fn(confDeadline));
    // check if date has passed, add 'past' class to it
    if (moment() - confDeadline > 0) {
      $('#conext2021').addClass('past');
    }
    $('#conext2021 .deadline-time').html(confDeadline.local().format('D MMM YYYY, h:mm:ss a'));
    deadlineByConf["conext2021"] = confDeadline;
  }
  
  
  
  
  var rawDeadlines = "2021-05-26 23:59:00" || [];
  if (rawDeadlines.constructor !== Array) {
    rawDeadlines = [rawDeadlines];
  }
  var parsedDeadlines = [];
  while (rawDeadlines.length > 0) {
    var rawDeadline = rawDeadlines.pop();
    // check if date is template
    if (rawDeadline.indexOf('%m') >= 0) {
      for (var m = 1; m <= 12; m++) {
        rawDeadlines.push(rawDeadline.replace('%m', m < 10 ? '0' + m : m));
      }
    } else if (rawDeadline.indexOf('%y') >= 0) {
      year = parseInt(moment().year());
      rawDeadlines.push(rawDeadline.replace('%y', year));
      rawDeadlines.push(rawDeadline.replace('%y', year + 1));

    } else {
      // adjust date according to deadline timezone
      
      var deadline = moment.tz(rawDeadline, "Etc/GMT+12"); // Anywhere on Earth
      

      // post-process date
      if (deadline.minutes() === 0) {
        deadline.subtract(1, 'seconds');
      }
      if (deadline.minutes() === 59) {
        deadline.seconds(59);
      }
      parsedDeadlines.push(deadline);
    }
  }
 
  // get abstract deadline
  
    
        var abstractDeadline = moment.tz("2021-05-19 23:59:00", "Etc/GMT+12"); // Anywhere on Earth
    
      // post-process date
    if (abstractDeadline.minutes() === 0) {
      abstractDeadline.subtract(1, 'seconds');
    }
    if (abstractDeadline.minutes() === 59) {
      abstractDeadline.seconds(59);
    }
    $('#acm-imc2021 .abstract-deadline-time').html("Abstract deadline: " + abstractDeadline.local().format('D MMM YYYY, h:mm:ss a'));
  


  // check which deadline is closest
  var confDeadline = parsedDeadlines[0];
  var today = moment();
  var confCycleNum = 1; 
  for (var i = 1; i < parsedDeadlines.length; i++) {
    deadlineCandidate = parsedDeadlines[i];
    if ((today.diff(deadlineCandidate) < 0 && today.diff(deadlineCandidate) > today.diff(confDeadline))) {
      confDeadline = deadlineCandidate;
      //$('#acm-imc2021 .iteration').html(`Review cycle ${confCycleNum} of ${parsedDeadlines.length}.`);
    }
  }

  // render countdown timer
  if (confDeadline) {
    function make_update_countdown_fn(confDeadline) {
      return function(event) {
        diff = moment() - confDeadline
        if (diff <= 0) {
           $(this).html(event.strftime('%D days %Hh %Mm %Ss'));
            if (diff > -1 * DAYS) {
              $('#acm-imc2021 .timer').addClass('day_away');
            } else if (diff > -7 * DAYS) {
              $('#acm-imc2021 .timer').addClass('week_away');
            }
        } else {
          $(this).html(confDeadline.fromNow());
        }
      }
    }
    $('#acm-imc2021 .timer').countdown(confDeadline.toDate(), make_update_countdown_fn(confDeadline));
    // check if date has passed, add 'past' class to it
    if (moment() - confDeadline > 0) {
      $('#acm-imc2021').addClass('past');
    }
    $('#acm-imc2021 .deadline-time').html(confDeadline.local().format('D MMM YYYY, h:mm:ss a'));
    deadlineByConf["acm-imc2021"] = confDeadline;
  }
  
  

  // Reorder list
  confs = $('.conf');
  confs.detach().sort(function(a, b) {
    var today = moment();
    var a = deadlineByConf[a.id];
    var b = deadlineByConf[b.id];
    var diff1 = today.diff(a)
    var diff2 = today.diff(b)
    if (a == null && b == null) {
      return 0;
    }
    if (a == null && diff2 > 0) {
      return -1;
    }
    if (a == null && diff2 < 0) {
      return +1;
    }
    if (b == null && diff1 > 0) {
      return +1;
    }
    if (b == null && diff1 < 0) {
      return -1;
    }
    if (diff1 < 0 && diff2 > 0) {
      return -1;
    }
    if (diff1 > 0 && diff2 < 0) {
      return +1;
    }
    if (diff1 < 0 && diff2 < 0) {
      return -1 ? diff1 < diff2 : +1;
    }
    if (diff1 > 0 && diff2 > 0) {
      return -1 ? a < b : +1;
    }
  });
  $('.conf-container').append(confs);

  // Name all tags
  var conf_type_data = [{"name":"Security","tag":"SEC"},{"name":"Privacy","tag":"PRIV"},{"name":"Crypto","tag":"CRYPTO"},{"name":"Infsec","tag":"INFOR"},{"name":"Networks","tag":"NET"},{"name":"Theory","tag":"THEO"},{"name":"Tier 1","tag":"T1"},{"name":"Tier 1-ε","tag":"Teps"},{"name":"Tier 2","tag":"T2"},{"name":"Tier ⊥","tag":"Tb"}];
  var all_subs = [];
  var sub2name = {}; var name2sub = {};
  for (var i = 0; i < conf_type_data.length; i++) {
    all_subs[i] = conf_type_data[i]['sub'];
    sub2name[conf_type_data[i]['tag']] = conf_type_data[i]['name'];
    name2sub[conf_type_data[i]['name']] = conf_type_data[i]['tag'];
  }

  
  
      
      $('#hotnets2021 .NET-tag').html(sub2name["NET"].toLocaleLowerCase());
  
      
      $('#hotnets2021 .Teps-tag').html(sub2name["Teps"].toLocaleLowerCase());
  
  
  
      
      $('#conext2021 .NET-tag').html(sub2name["NET"].toLocaleLowerCase());
  
      
      $('#conext2021 .Teps-tag').html(sub2name["Teps"].toLocaleLowerCase());
  
  
  
      
      $('#acm-imc2021 .NET-tag').html(sub2name["NET"].toLocaleLowerCase());
  
      
      $('#acm-imc2021 .T1-tag').html(sub2name["T1"].toLocaleLowerCase());
  
  

  // Set checkboxes
  var conf_type_data = [{"name":"Security","tag":"SEC"},{"name":"Privacy","tag":"PRIV"},{"name":"Crypto","tag":"CRYPTO"},{"name":"Infsec","tag":"INFOR"},{"name":"Networks","tag":"NET"},{"name":"Theory","tag":"THEO"},{"name":"Tier 1","tag":"T1"},{"name":"Tier 1-ε","tag":"Teps"},{"name":"Tier 2","tag":"T2"},{"name":"Tier ⊥","tag":"Tb"}];
  var all_tags = [];
  var toggle_status = {};
  for (var i = 0; i < conf_type_data.length; i++) {
    all_tags[i] = conf_type_data[i]['tag'];
    toggle_status[all_tags[i]] = false;
  }
  var tags = store.get('FIND A DOMAIN');
  if (tags === undefined) {
    tags = all_tags;
  }
  for (var i = 0; i < tags.length; i++) {
    $('#' + tags[i] + '-checkbox').prop('checked', true);
    toggle_status[tags[i]] = true;
  }
  store.set('FIND A DOMAIN', tags);

  function update_conf_list() {
    confs.each(function(i, conf) {
      var conf = $(conf);
      var show = false;
      for (var i = 0; i < all_tags.length; i++) {
        if(conf.hasClass(all_tags[i])) {
          show = show | toggle_status[all_tags[i]];
        }
      }
      if (show) {
        conf.show();
      } else {
        conf.hide()
      }
    });
  }
  update_conf_list();

  // Event handler on checkbox change
  $('form :checkbox').change(function(e) {
    var checked = $(this).is(':checked');
    var tag = $(this).prop('id').slice(0, -9);
    toggle_status[tag] = checked;

    if (checked == true) {
      if (tags.indexOf(tag) < 0)
        tags.push(tag);
    }
    else {
      var idx = tags.indexOf(tag);
      if (idx >= 0)
        tags.splice(idx, 1);
    }
    store.set('FIND A DOMAIN', tags);
    update_conf_list();
  });
});
