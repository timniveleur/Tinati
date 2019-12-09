$(function(){
    var perPage = 1;
    $(document).on('click', '#loadMore', function(){
        perPage++;
        getVideos(perPage);
    });
})

function generateVideoList(list){
    $.each(list, function(index, elem){
        var col = $('<div class="col-12 col-sm-6 col-lg-4" style="margin-bottom:10px;"></div>');
        var frame = $('<iframe width="100%" height="315" frameborder="0" allowfullscreen ></iframe>');
        frame.attr('src', ytsc(elem.link));
        col.append(frame);
        $('#videoList').append(col);
    })
}

function getVideos(perPage){
    $.ajax({
        type: "POST",
        url: "/getvideos",
        data: {
            'perPage' : perPage,
            'category' : $('#category').val()
            },
        dataType: "json",
        success: function (response) {
            generateVideoList(response.data);
            if(response.current_page >= response.last_page){
                hideMoreLink();
            }
            console.log(response);
        },
        error: function(response) {
        }
    });
}

function hideMoreLink(){
    $('#loadMore').addClass('d-none');
}

function ytsc(link){
    return link.replace('youtu.be/', 'www.youtube.com/embed/');
}