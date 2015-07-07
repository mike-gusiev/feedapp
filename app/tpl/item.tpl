{{#each data}}
<div class="panel panel-default">
    <div class="panel-heading">
        <div class="date">{{id_str}} || {{created_at}}</div>
        <h3 class="panel-title">{{user.name}}</h3>
    </div>
    <div class="panel-body">
        {{text}}
    </div>
</div>
{{/each}}