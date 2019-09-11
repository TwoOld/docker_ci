const http = require('http')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/docker_deploy', secret: 'archiechiu' })
// 上面的 secret 保持和 GitHub 后台设置的一致

const spawn = require('child_process').spawn
function run_cmd(cmd, args, callback) {
  const child = spawn(cmd, args)
  let resp = ''

  child.stdout.on('data', function(buffer) {
    resp += buffer.toString()
  })
  child.stdout.on('end', function() {
    callback(resp)
  })
}
// debug用
// run_cmd('sh', ['./deploy-dev.sh'], function(text){ console.log(text) });

http
  .createServer((req, res) => {
    handler(req, res, err => {
      res.statusCode = 404
      res.end('no such location')
    })
  })
  .listen(8888, () => {
    console.log('WebHooks Listern at 8888')
  })

handler.on('error', function(err) {
  console.error('Error:', err.message)
})

// handler.on('*', function(event) {
//   console.log('Received *')
//   run_cmd('sh', ['./deploy-dev.sh'], function(text) {
//     console.log(text)
//   })
// })

handler.on('push', function(event) {
  // 分支判断
  if (event.payload.ref === 'refs/heads/master') {
    console.log('deploy master..')
    run_cmd('sh', ['./deploy-dev.sh'], function(text) {
      console.log(text)
    })
  }
})

// handler.on('issues', function (event) {
//     console.log('Received an issue event for % action=%s: #%d %s',
//         event.payload.repository.name,
//         event.payload.action,
//         event.payload.issue.number,
//         event.payload.issue.title)
// })
