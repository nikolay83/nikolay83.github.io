Users:
Their are three users

admin/password  for admin role
owner/password for owner role &
approver/password for approver's role.

new user can also be added by using the "data/db.json" files
-----------------
- Pleae ingnore *.css.map files.

------
- The angularJS modules are main defined based on user roles as they have interconnect pages/functions/routes.

-------
app/data: contains the dummy data in json format.

--------
app/blocks: contains common features/functions/directives that are shared for all other modules

----------
app/core: contains the core component, these are generally site entry point functions.

------
All admin pages starts with "#/admin/*.**"
owner pages starts with "#/owner/*.**"  &
approver pages starts with "#/approver/*.**"

-adding new record to table (#/admin/edit/processes):
refer the workflow: https://gyazo.com/3ea2105e77aac101a793f330bcebe36a
>> It may seem a bit odd but validation steps are not present in spec. so neither they added.
>> Before adding items to the last column just make sure at lease one element must be selected in the parent column( 2nd column).





