var colors_filter = [];
var length_filter = [];
var type_filter = [];
var team_filter = [];
var photos;
var s = 0;
var count = 10;
var last = true;
$(function(){

    $(document).on('click', '.js-filter-apply', function() {
        $('#underfilter').slideUp();
    });

    $(document).mouseup(function (e){
        var filter = $('#filter');
        var underfilter = $('#underfilter');
        var itsNotFilter = (!filter.is(e.target)  && filter.has(e.target).length === 0);
        var itsNotUnderfilter = (!underfilter.is(e.target)  && underfilter.has(e.target).length === 0);
        if (itsNotFilter && itsNotUnderfilter) { // и не по его дочерним элементам
            $('#underfilter').slideUp();
        }
    });

    $.ajax({
        type: "POST",
        url: "/getfilter",
        data: {"slug" : $('#slug').val()},
        success: function (response) {
            generateFilter(response);
            $('.mobRow').hide();
            $.ajax({
                type: "POST",
                url: "/getphotos",
                data: {"slug" : $('#slug').val()},
                success: function (response) {
                    photos = response;
                    list = rFilter(photos);
                    clearPhoto();
                    generatePhoto(list, s, count);
                    revertFilter(list, name, photos);
                    $('.mobRow').hide();
                }
            });
        }
    });

    $('#underfilter').hide();

    $(document).on('click', '#loadmore', function (){
        s += count;
        generatePhoto(photos, s, count)
    });

    $(document).on('click', 'input[type=checkbox]', function(){
        name = $(this).attr('name');
        val = $(this).val();
        checked = $(this).prop('checked');

        makeFilter(name, val, checked);
        list = rFilter(photos);
        clearPhoto();
        generatePhoto(list, s, count);
        revertFilter(list, name, photos);

    });

    $(document).on('click', '#filter .col-md-3', function(){
            $('#underfilter').slideToggle();
        // }
        $('.mobRow-'+$(this).data('name')).slideToggle();
        $(this).toggleClass('close');
        last = $(this).data('name');
    })
});

function rFilter(photos) {
    list = _.filter(photos, function (elem) {
        f_color = photoFilter(colors_filter, 'color', elem);
        f_length = photoFilter(length_filter, 'length', elem);
        f_type = photoFilter(type_filter, 'type', elem);
        f_team = photoFilter(team_filter, 'team', elem);
        return f_color && f_length && f_type && f_team;
    });
    return list;
}



function revertFilter(list, iname, photos){
    var color_ids = [];
    var type_ids = [];
    var length_ids = [];
    var team_ids = [];
    f_type = helper3('type');
    f_color = helper3('color');
    f_length = helper3('length');
    f_team = helper3('team');
    helper2('type', type_ids, list, iname);
    helper2('color', color_ids, list, iname);
    helper2('length', length_ids, list, iname);
    helper2('team', team_ids, list, iname);
    if(!f_color && !f_length && !f_team){
        helper2('type', type_ids, photos);
    }
    if(!f_type && !f_length && !f_team){
        helper2('color', color_ids, photos);
    }
    if(!f_color && !f_type && !f_team){
        helper2('length', length_ids, photos);
    }
    if(!f_color && !f_type && !f_length){
        helper2('team', team_ids, photos);
    }
}

function helper2(name, ids, list, iname = ''){
    if(iname != name){
        var inputName = 'input[name='+name+']';
        $.each($(inputName), function (indexInArray, elem) {
            ids[$(elem).val()] = false;
        });
        $.each(list, function (i, e) {
            $.each(e[name], function (ic, ec) {
                if(name == 'team'){
                    ec = ec.id;
                }
                ids[ec] = true;
            })
        })
        $.each($(inputName), function (i, elem) {
            if( ids[$(elem).val()] == false){
                $(elem).parent().addClass('disabled');
                $(elem).attr('disabled', true);
            } else {
                $(elem).parent().removeClass('disabled');
                $(elem).attr('disabled', false);
            }
        })
    }
}

function helper3(name){
    f = false
    $('input[name="'+name+'"').each(function (index, element) {
        // element == this
        if($(element).prop('checked')){
            f = true;
            return;
        }
    });
    return f;
}

function photoFilter(filter, type, elem){
    fi = false;
    if(filter.length > 0) {
        $.each(elem[type], function (i, e) {
            if(type == 'team'){
                e = e.id+'';
            }
            if(_.indexOf(filter, e) >= 0){
                fi = true;
                return;
            }
        })
    } else {
        fi = true;
    }
    return fi;
}

function makeFilter(name, val, checked) {
    switch (name) {
        case 'color':
            colors_filter = setMas(checked, colors_filter, val);
            break;
        case 'length':
            length_filter = setMas(checked, length_filter, val);
            break;
        case 'type':
            type_filter = setMas(checked, type_filter, val);
            break;
        case 'team':
            team_filter = setMas(checked, team_filter, val);
            break;
        default:
            break;
    }
}

function setMas(checked, list, val){
    if (checked) {
        list.push(val);
    } else {
        list = _.without(list, val);
    }
    return list;
}

function generatePhoto(list, s = 0, count = 2){

    if(s < list.length){
        var e = s + count;
        if( e >= list.length ){
            e = list.length;
        }
        for(var i = s; i < e; i++){
            var col = $('<div class="col-6 col-md-4" style="margin-bottom:10px;" ></div>')
            var img = $('<img class="w-100" src="'+list[i].img.path+'" alt="">');
            col.append(img);
            $('#photos').append(col);
            $('#loadmore').removeClass('d-none');
            if( i >= (list.length - 1) ){
                $('#loadmore').addClass('d-none');
            }
        };
    } else {
    }
    if(list.length < 1){
            $('#photos').append($('<div class="col-12 notfoundcontent" > Ничего не найдено </div>'));
            $('#loadmore').addClass('d-none');
    }
}

function clearPhoto(){
    $('#photos').text('');
}

function generateFilter(list){
    if (list.type.length > 0){
        filterMixin('Услуга', 'type', list.type, ['title'], 'col-12 col-md-3 filter-top filter-type', 'col-12 col-md-3 col-inputs col-inputs-type');
    }
    if (list.color.length > 0){
        filterMixin('Цвет волос', 'color', list.color, ['title'], 'col-12 col-md-3 filter-top filter-color', 'col-12 col-md-3 col-inputs col-inputs-color');
    }
    if (list.length.length > 0){
        filterMixin('Длина волос', 'length', list.length, ['title'], 'col-12 col-md-3 filter-top filter-length', 'col-12 col-md-3 col-inputs col-inputs-length');
    }

    // $('#underfilter').append($('<div class="col-12"><div class="ct-grid"><button class="underfilter__btn-apply js-filter-apply">Применить</button></div></div>'));
    // if (list.team.length > 0){
    //     filterMixin('Мастер', 'team', list.team, ['first_name'], 'col-12 col-md-3 filter-top filter-team', 'col-12 col-md-3 col-inputs col-inputs-team');
    // }
}

function filterMixin(name, checkboxName, list, title, cssClassMenu, cssClassInput){
    var menu = $('<div class="'+cssClassMenu+'" data-name="'+checkboxName+'">'+name+'</div>');
    var col3 = $('<div class="'+cssClassInput+'"></div>');

    var row = $('<div class="row"></div>');

    var mobRow = $('<div class="row mobRow mobRow-'+checkboxName+'"></div>');

    $.each(list, function (indexInArray, valueOfElement) {
        var mobMenu = $('<div class="col-12"></div>');

        var str = '';
        $.each(title, function(i, e){
            str += valueOfElement[e]+' ';
        });
        if(checkboxName == 'team'){
            var col = $('<div class="col-6"></div>');
        } else {
            var col = $('<div class="col-12"></div>');
        }
        var checkbox = $('<label class="c_chechbox">'+str+'<input type="checkbox" name="'+checkboxName+'" value="'+valueOfElement.id+'"><span class="checkmark"></span></label>');

        mobMenu.append($('<label class="c_chechbox">'+str+'<input type="checkbox" name="'+checkboxName+'" value="'+valueOfElement.id+'"><span class="checkmark"></span></label>'));
        mobRow.append(mobMenu);

        col.append(checkbox);
        row.append(col);
    });
    col3.append(row);
    $('#underfilter').append(col3);
    $('#filter').append(menu);
    $('#filter').append($('<div class="col-12  d-md-none"></div>').append(mobRow));
}
