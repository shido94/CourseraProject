		
$.material.init();

$(function(){

  if($('.registerdUser').text()!=''){
  	$('#thankyou').modal('toggle')
  }

    if($('.emailpresent').text()!=''){
  	$('#getService').modal('toggle')
  }


  $('body').on({click:function(){

      var id=$(this).attr('data-id');

      $('input[name="cancelid"]').val(id);


  }},'.cancelAppoint')

})