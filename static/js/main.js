---
---
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

  {% for conf in site.data.conferences %}
  {% assign conf_id = conf.name | append: conf.year | slugify %}
  {% if conf.deadline == "TBA" %}
  $('#{{ conf_id }} .timer').html("TBA");
  $('#{{ conf_id }} .deadline-time').html("TBA");
  deadlineByConf["{{ conf_id }}"] = null;

  {% else %}
  var rawDeadlines = {{ conf.deadline | jsonify }} || [];
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
      {% if conf.timezone %}
      var deadline = moment.tz(rawDeadline, "{{ conf.timezone }}");
      {% else %}
      var deadline = moment.tz(rawDeadline, "Etc/GMT+12"); // Anywhere on Earth
      {% endif %}

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
  {% if conf.abstract %}
    {% if conf.timezone %}
        var abstractDeadline = moment.tz("{{conf.abstract}}", "{{ conf.timezone }}");
      {% else %}
        var abstractDeadline = moment.tz("{{conf.abstract}}", "Etc/GMT+12"); // Anywhere on Earth
    {% endif %}
      // post-process date
    if (abstractDeadline.minutes() === 0) {
      abstractDeadline.subtract(1, 'seconds');
    }
    if (abstractDeadline.minutes() === 59) {
      abstractDeadline.seconds(59);
    }
    $('#{{ conf_id }} .abstract-deadline-time').html("Abstract deadline: " + abstractDeadline.local().format('D MMM YYYY, h:mm:ss a'));
  {% else %}
     $('#{{ conf_id }} .abstract-deadline-time').html("No abstract deadline.");
  {% endif %}


  // check which deadline is closest
  var confDeadline = parsedDeadlines[0];
  var today = moment();
  var confCycleNum = 1; 
  for (var i = 1; i < parsedDeadlines.length; i++) {
    deadlineCandidate = parsedDeadlines[i];
    if ((today.diff(deadlineCandidate) < 0 && today.diff(deadlineCandidate) > today.diff(confDeadline))) {
      confDeadline = deadlineCandidate;
      //$('#{{ conf_id }} .iteration').html(`Review cycle ${confCycleNum} of ${parsedDeadlines.length}.`);
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
              $('#{{ conf_id }} .timer').addClass('day_away');
            } else if (diff > -7 * DAYS) {
              $('#{{ conf_id }} .timer').addClass('week_away');
            }
        } else {
          $(this).html(confDeadline.fromNow());
        }
      }
    }
    $('#{{ conf_id }} .timer').countdown(confDeadline.toDate(), make_update_countdown_fn(confDeadline));
    // check if date has passed, add 'past' class to it
    if (moment() - confDeadline > 0) {
      $('#{{ conf_id }}').addClass('past');
    }
    $('#{{ conf_id }} .deadline-time').html(confDeadline.local().format('D MMM YYYY, h:mm:ss a'));
    deadlineByConf["{{ conf_id }}"] = confDeadline;
  }
  {% endif %}
  {% endfor %}

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
  var conf_type_data = {{ site.data.types | jsonify }};
  var all_subs = [];
  var sub2name = {}; var name2sub = {};
  for (var i = 0; i < conf_type_data.length; i++) {
    all_subs[i] = conf_type_data[i]['sub'];
    sub2name[conf_type_data[i]['tag']] = conf_type_data[i]['name'];
    name2sub[conf_type_data[i]['name']] = conf_type_data[i]['tag'];
  }

  {% for conf in site.data.conferences %}
  {% for sub in conf.tags %}
      {% assign conf_id = conf.name | append: conf.year | slugify %}
      $('#{{conf_id}} .{{sub}}-tag').html(sub2name["{{sub}}"].toLocaleLowerCase());
  {% endfor %}
  {% endfor %}

  // Set checkboxes
  var conf_type_data = {{ site.data.types | jsonify }};
  var all_tags = [];
  var toggle_status = {};
  for (var i = 0; i < conf_type_data.length; i++) {
    all_tags[i] = conf_type_data[i]['tag'];
    toggle_status[all_tags[i]] = false;
  }
  var tags = store.get('{{ site.domain }}');
  if (tags === undefined) {
    tags = all_tags;
  }
  for (var i = 0; i < tags.length; i++) {
    $('#' + tags[i] + '-checkbox').prop('checked', true);
    toggle_status[tags[i]] = true;
  }
  store.set('{{ site.domain }}', tags);

  function update_conf_list() {
    confs.each(function(i, conf) {
      var conf = $(conf);
      var show = false;
      console.log(toggle_status);
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
    store.set('{{ site.domain }}', tags);
    update_conf_list();
  });

  // Reset the tags
  function reset_tags() {
    for (var i = 0; i < all_tags.length; i++) {
      $('#' + all_tags[i] + '-checkbox').prop('checked', true);
      toggle_status[all_tags[i]] = true;
    }
    tags = all_tags
    store.set('{{ site.domain }}', tags);
    update_conf_list();
  }

  $( "#reset-button" ).click(function() {
    reset_tags();
  });

  // Tag selection
  $('.conf-sub').click(function(e) {
    var csub = $(this).data('sub');
    console.log(tags)
    for (var i = 0; i < tags.length; i++) {
      if (tags[i] != csub) {
        toggle_status[tags[i]] = false;
        $('#' + tags[i] + '-checkbox').prop('checked', false);
        $('.' + tags[i] + '-conf').hide();
      }
    }
    $('#' + csub + '-checkbox').prop('checked', true);
    toggle_status[csub] = true;
    tags = [csub];
    console.log(tags);
    store.set('{{ site.domain }}', tags);
    update_conf_list();
  });


});
