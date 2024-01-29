ssh root@conversation-demo.de "cd /root/conversations && git pull && docker compose up -d --build && docker system prune -f"
