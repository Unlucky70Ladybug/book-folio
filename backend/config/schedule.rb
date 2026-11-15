
require File.expand_path(File.dirname(__FILE__) + "/environment")
set :output, 'log/cron.log'

# 1分毎に回す
every 10.minute do
  command "echo '***********TEST TEST TEST TEST TEST TEST***********'"
end

# every :day, :at => '2:30 am', :roles => [:app] do
#   runner "Rakuten API batch"
#   command "rm log/cron.log"
#   rake "rakuten_api:task"
# end
