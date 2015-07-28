var app = angular.module('displayPortfolio', ['ui.router','ngAnimate']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  var stateProvider = $stateProvider;

    stateProvider
    .state('portfolioTagged', {
        url: '/portfolio/:tag',
        controller: 'portfolioCtrl',
        templateUrl: 'views/portfolio.html',
    });

    stateProvider
    .state('project', {
        url: '/project/:title/:tags',
        controller: 'projectCtrl',
        templateUrl: 'views/project.html',
    });



  $urlRouterProvider.otherwise('portfolio/');


}]);



app.service('portfolio', function portfolio($http,$q){

    var portfolio = this;
    portfolio.projects={};

    //Get all projects
    portfolio.getAllProjects = function(){

        var defer = $q.defer();

        $http.get('/portfolio/')
        .success(function(res){
            portfolio.projects = res;
            defer.resolve(res);
        })
        .error(function(err, status){
            defer.reject(err);
        })
        return defer.promise;
    }

    //Get 1 project, also gets next and previous
    portfolio.getProject = function(title,tags){

        var defer = $q.defer();
        $http.get('/project/' + title + '/' + tags)
        .success(function(res){
            portfolio.project = res;
            defer.resolve(res);
        })
        .error(function(err,status){
            defer.reject(err);
        })
        return defer.promise;
    }


    return portfolio;

});




app.controller('portfolioCtrl',function ($scope, portfolio, $stateParams, $state){

    $scope.init=function(){
     $scope.active=[false,false,false,false,false,false];
        if($stateParams.tag!=='' && $stateParams.tag!==null){
            $scope.tags=$stateParams.tag.split('+');
            $scope.tags.forEach(function(tag){
                    if(tag==='animation'){
                        $scope.active[1]=true;
                    }
                    if(tag==='illustration'){
                        $scope.active[2]=true;
                    }
                    if(tag==='design'){
                        $scope.active[3]=true;
                    }
                    if(tag==='motion_graphics'){
                        $scope.active[4]=true;
                    }
                    if(tag==='character_design'){
                        $scope.active[5]=true;
                    }
                    if(tag==='storyboard'){
                        $scope.active[6]=true;
                    }
                })
            $scope.portfolioBackground=$scope.tags[$scope.tags.length-1];

        }      
        else{
            $scope.tags=[];
        }
        $scope.jquery();
        $scope.getAll();
    }


    $scope.jquery = function(){

        $(function(){
          

            $tagsWrapper=$('.tagsWrapper');
            $tagsToggle=$tagsWrapper.find('.tagsToggle');

             $tagsToggle.click(function(){
                 $tagsWrapper.toggleClass('active');
            });
        })
    }



    $scope.getAll = function(){

        portfolio.getAllProjects()
        .then(function(res){
            $scope.projects=portfolio.projects;
        },function(err){
            //error
        })


        $scope.toggleTag = function(id,tag){
            var tags=$scope.tags;
            var active=!$scope.active[id];
            //toggle active class
            $scope.active[id]=active;
            //tag was pressed inserts tag into array
            if(active){
               tags.push(tag);
            }
            else{ // removes the tag
                var index = tags.indexOf(tag);
                tags.splice(index,1);

            }
            if(tags.length){// if there are tags selected
                $scope.portfolioBackground=tags[tags.length-1];
            }
            else{ // resets portfolio background
                $scope.portfolioBackground='';
            }
            $state.go('portfolioTagged', {tag: tags.join('+')} , {notify:false, reload:false});
        }

       
         $scope.goToProject = function(title,tags){
                $state.go('project', {title:title, tags:tags}, {notify:true,reload:true});

            };
    }


    $scope.init();

});


app.controller('projectCtrl',function ($http, $scope, portfolio, $stateParams, $sce, $state, $timeout){

    $scope.init=function(){
        var title=$stateParams.title;
        var tags=$stateParams.tags;
        if(!title || title=='undefined'){
            $state.go('portfolioTagged', {tag:tags}, {notify:true, reload:false});
        }
        $scope.getProject(title, tags);
        $scope.Jquery();
    }

    $scope.Jquery = function(){

        $(function(){

            
            scroll(0,0);
            

            $projectShowcase=$('.projectShowcase');


             $projectShowcase.on("click", ".thumbnail", function() {
                var source = $(this).attr('data-source');
                $target=$('.mediaWrapper *[data-source="' + source + '"]');
                $('html,body').animate({
                    scrollTop: ($target.offset().top)-20
                    },700);
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
            });

            $.fn.scrollEnd = function(callback, timeout) {          
                $(this).scroll(function(){
                    var $this = $(this);
                    if ($this.data('scrollTimeout')) {
                      clearTimeout($this.data('scrollTimeout'));
                    }
                    $this.data('scrollTimeout', setTimeout(callback,timeout));
                  });
                };



            $thumbnails=$('.thumbnails');
            thumbnailsPosition=$thumbnails.offset().top+140;


            $(window).scrollEnd(function(){
                if($(this).scrollTop() > (thumbnailsPosition +40)){
                    $thumbnails.animate({"padding-top": ($(this).scrollTop() - thumbnailsPosition - 20 )}, 250);
                }
                else(
                    $thumbnails.animate({"padding-top": 20},250)
                )
            },700);



        })
    }


    $scope.getProject = function(title, tags){
        portfolio.getProject(title,tags)
        .then(function(res){
            $scope.currentProject=portfolio.project.project[0];
            if($scope.currentProject.videoLink){
                var videoThumbnail='';
                var videoId=$scope.currentProject.videoLink.split('/')[3];
                $http.get('http://vimeo.com/api/v2/video/' + videoId + '.json')
                .success(function(res){
                    $scope.videoThumbnail=res[0].thumbnail_medium;
                })
                .error(function(err,status){
                    console.log(err);
                });

                $scope.videoLink="https://player.vimeo.com/video/" + videoId + "?color=ff0179&byline=0&portrait=0";
            }
            $scope.images=$scope.currentProject.images.split(',');
            $scope.tags=$scope.currentProject.tags;
            $scope.nextProject=portfolio.project.next[0];
            if(!$scope.nextProject){
                $scope.nextNotExists = true
            }
            else(
                $scope.nextNotExists = false
            )
            $scope.previousProject=portfolio.project.previous[0];
             if(!$scope.previousProject){
                $scope.previousNotExists = true
            }
            else(
                $scope.previousNotExists = false
            )


            $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };

            $scope.loadBar = function(){
                $scope.load='load';
            };

            $scope.showCurrentProjectClass = function(){
                $scope.currentProjectClass='fadeIn';
            };

            $scope.playVideo = function(){
                $scope.videoLink += '&autoplay=1';
            };

            $scope.load = 'stretch';

            $scope.goToNextProject = function(title){
                title=title.split(' ').join('_');
                $state.go('project', {title:title, tags:tags}, {notify:false,reload:false});
                //bounce current project left
                $scope.currentProjectClass='bounceOutLeft';
                $scope.load='';
                //load new project
                $timeout(function(){$scope.getProject(title,tags)},200);
                //bounce in new project
                $timeout(function(){ $scope.currentProjectClass='fadeIn'},600);
            };

            $scope.goToPreviousProject = function(title){
                title=title.split(' ').join('_');
                $state.go('project', {title:title, tags:tags}, {notify:false,reload:false});
                //bounce current project left
                $scope.currentProjectClass='bounceOutRight';
                $scope.load='';
                //load new project
                $timeout(function(){$scope.getProject(title,tags)},200);
                //bounce in new project
                $timeout(function(){$scope.currentProjectClass='fadeIn'},600);
            };

            $scope.goToPortfolio = function(){
                $state.go('portfolioTagged', {tag: $stateParams.tags}, {notify:true,reload:true});
            };

        },function(err){
            //error
        })
    };




    $scope.init();
});



app.filter('filterByTags', function () {
    return function (items, tags) {
        if(tags.length === 0){
            return items;
        }
        var filtered = [];
        (items || []).forEach(function (item) {
            var matches = tags.some(function (tag) {    // If there is some tag
                var tag=tag.split('_').join(' ');
                return (item.tags.indexOf(tag) > -1) || // that is a substring
                       (item.tags.indexOf(tag) > -1);   // of the itmes tags
            });                                         // we have a match
            if (matches) {           // If it matches
                filtered.push(item); // put it into the `filtered` array
            }
        });
        return filtered; // Return the array with items that match any tag
    };
});