const fetchGetConf = {
    method: 'GET',
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
}

function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}


function getAjaxFeedback(params) {
    let url = '?page=' + params.page;

    if (params.type === 'video') {
        url += '&_handler=onGetVideos';
    } else {
        url += '&_handler=onGetFeedback';
    }

    params.filter.forEach((master) => {
        url += '&masters[]=' + master;
    });


    if (params.filter) {

    }

    return fetch(url, fetchGetConf)
        .then((response) => {
            return response.json().then((feedback) => {
                return feedback;
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

const feedbackBlocks = document.getElementsByClassName('js-feedback-block');
const feedbackBlocksElements = Array.prototype.slice.call(feedbackBlocks);
let apps = {};

feedbackBlocksElements.forEach((appElement) => {
    const type = appElement.getAttribute('data-type');

    apps[type] = new Vue({
        el: appElement,
        delimiters: ['||', '||'],
        data: {
            type: type,
            feedback: [],
            page: 1,
            hasMore: true,
            filter: [],
            filterDisabled: true,
            loading: false
        },
        mounted: function() {
            initBtnsPopup();
        },
        updated: function() {
            initBtnsPopup();
        },
        watch: {
            filterDisabled: function(value) {
                if (value) {
                    this.feedback.splice(0, this.feedback.length);
                    this.filter.splice(0, this.filter.length);
                    this.page = 1;
                }

                setTimeout(() => {
                    if (this.filter.length === 0 && !value) this.filterDisabled = true;
                }, 0);

            },
            filter: function(value) {
                this.filterDisabled = (value.length === 0);

                if (value.length > 0) {
                    this.feedback.splice(0, this.feedback.length);
                    this.page = 0;
                    this.getFeedback();
                }
            }
        },
        computed: {
            filterBtnText: function() {
                if (this.filter.length > 0) {
                    var word1 = declOfNum(this.filter.length, ['Выбран', 'Выбрано', 'Выбрано']);
                    var word2 = declOfNum(this.filter.length, ['мастер', 'мастера', 'мастеров']);
                    return word1 + ' ' + this.filter.length + ' ' + word2;
                }

                return 'Все мастера';
            }
        },
        methods: {
            enter(element) {
                const width = getComputedStyle(element).width;
                element.style.width = width;
                element.style.position = 'absolute';
                element.style.visibility = 'hidden';
                element.style.height = 'auto';
                const height = getComputedStyle(element).height;
                element.style.width = null;
                element.style.position = null;
                element.style.visibility = null;
                element.style.height = 0;
                getComputedStyle(element).height;
                setTimeout(() => {
                    element.style.height = height;
                });
            },
            afterEnter(element) {
                element.style.height = 'auto';
            },
            leave(element) {
                const height = getComputedStyle(element).height;
                element.style.height = height;
                getComputedStyle(element).height;
                setTimeout(() => {
                    element.style.height = 0;
                });
            },
            getMasterById: function(id) {

                let $master = masters.filter((master) => {
                    return master.external_id == id;
                }).shift();

                return  $master ? $master.first_name : '';
            },
            getFeedback: function() {

                this.loading = true;

                this.page++;
                const params = {
                    page: this.page,
                    type: this.type,
                    filter: this.filter
                };

                getAjaxFeedback(params).then((result) => {
                    if (this.type === 'video') var feedbackItems = result.data;
                    if (this.type === 'salon') var feedbackItems = result.feedbackBySalon.items;
                    if (this.type === 'master') var feedbackItems = result.feedbackByMasters.items;
                    if (this.type === 'master' && !this.filterDisabled) var feedbackItems = result.feedbackByMaster.items;

                    if (this.type === 'video') var count = result.total;
                    if (this.type === 'salon') var count = result.feedbackBySalon.count;
                    if (this.type === 'master') var count = result.feedbackByMasters.count;
                    if (this.type === 'master' && !this.filterDisabled) var count = result.feedbackByMaster.count;

                    this.addFeedback(feedbackItems);
                    if (count === (this.feedback.length + 3) || !feedbackItems.length) {
                        this.hasMore = false;
                    }

                    this.loading = false;
                });
            },
            addFeedback: function(items) {
                items.forEach((item) => {
                    this.feedback.push(item);
                });
            }
        }
    });
});



const formFeedback = new Vue({
    el: '#feedback-form',
    delimiters: ['||', '||'],
    data: {
        mark: 5,
        name: '',
        master: false,
        text: '',
        sended: false
    },
    methods: {
        send: function() {
            this.sended = true;
            let url = '?';
            url += 'mark=' + this.mark;
            url += '&name=' + this.name;
            url += '&text=' + this.text;
            if (this.master !== false) url += '&master=' + this.master;


            if (this.name === '' || this.text ==='') return;

            url += '&_handler=onSendFeedback';

            return fetch(url, fetchGetConf)
                .then((response) => {
                    togglePopup('popup-message');
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        close: function() {
            togglePopup('popup-rewrite');
        }
    }
});