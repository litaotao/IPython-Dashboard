<script type="text/javascript">
  var gridster;

  $(function(){

    gridster = $(".gridster ul").gridster({
      widget_base_dimensions: [100, 55],
      widget_margins: [5, 5],
      helper: 'clone',
      resize: {
        enabled: true
      }
    }).data('gridster');

  });
</script>