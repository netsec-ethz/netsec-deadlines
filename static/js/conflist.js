---
---
const DAYS = 60 * 60 * 24 * 1000;

$(function() {


  confByMonth = {};

  {% for conf in site.data.conferences %}
      {% assign conf_id = conf.name | append: conf.year | slugify %}
      {% if conf.deadline != "TBA" %}
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
          // check which deadline is closest
         // Aggregate all conferences by month of deadline
          for (var i = 0; i < parsedDeadlines.length; i++) {
            deadlineMonth = parsedDeadlines[i].local().format('MMMM');
            if (!confByMonth[deadlineMonth]) {
                    confByMonth[deadlineMonth] = [];
                }
            if (!confByMonth[deadlineMonth].includes('{{ conf.name }}')){
                confByMonth[deadlineMonth].push('{{ conf.name }}')
            }
          }
        //$('#{{ conf_id }} .deadline-time').html(confDeadline.local().format('MMMM'));
        //deadlineByConf["{{ conf_id }}"] = confDeadline;
  {% endif %}
  {% endfor %}

  {% for month in site.data.months %}
        console.log(confByMonth['{{ month }}']);
        var curConfs = confByMonth['{{ month }}'];
        if (curConfs) {
            curConfs.sort()
            var list = document.createElement('ul');
            for (var i = 0; i < curConfs.length; i++) {
                var item = document.createElement('li');
                item.appendChild(document.createTextNode(curConfs[i]));
                list.appendChild(item);
            }
        $('#{{ month }} .month-confs').append(list) ;
        } else {
            $('#{{ month }} .month-confs').html("(No conference deadlines)") ;
        }

  {% endfor %}
});
