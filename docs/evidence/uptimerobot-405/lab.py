import http.server,threading,subprocess,json
from pathlib import Path
class H(http.server.BaseHTTPRequestHandler):
 protocol_version='HTTP/1.1'
 def log_message(self,*a):pass
 def do_HEAD(self):
  self.send_response(405);self.send_header('Allow','GET');self.send_header('Content-Length','0');self.end_headers()
 def do_GET(self):
  body=b'healthy page\n';status=503 if self.path=='/down' else 200
  self.send_response(status);self.send_header('Content-Type','text/plain');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
s=http.server.ThreadingHTTPServer(('127.0.0.1',0),H);threading.Thread(target=s.serve_forever,daemon=True).start();url='http://127.0.0.1:'+str(s.server_port)
r={}
for name,args in [('head',['-I']),('get',['-sS','-D','-','-o','/dev/null']),('negative_get',['-sS','-D','-','-o','/dev/null'])]:
 r[name]=subprocess.check_output(['curl',*args,'--max-time','15',url+('/down' if name=='negative_get' else '/')],stderr=subprocess.DEVNULL,text=True)
s.shutdown();p=Path('docs/evidence/uptimerobot-405');p.mkdir(parents=True,exist_ok=True);(p/'lab-results.json').write_text(json.dumps(r,indent=2));(p/'lab.py').write_text(Path(__file__).read_text());print(json.dumps(r,indent=2))
