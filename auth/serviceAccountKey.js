let serviceAccount = {
  "type": "service_account",
  "project_id": "ziv-ai",
  "private_key_id": process.env.private_key_id,//"9de0f45027580783ee921b1d7ed3ac64454a49b1",
  "private_key": process.env.private_key.replace(/\\n/g, '\n'),//"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDY5yE/rLv8g0kk\nx0WKvllzaw2KmYZf4yZ1mvxFOXJdYNPoIqR4KzbQXQGRoPilNhirpsRSD+NpIIDU\nO0ocpq0hLP/m8hMTMw85xxUz8lCncceGHz2eOnKfjFeqPJ8L4I8tZ602HoipbFym\netg22Q/WWi8u/s0wrgwgxRgz1HiZWGO74amQik5TeHYFgJeXwFIB3+SsjQ7/qH5N\n9qR4TIwZpjVChpgW0bnRy6HebSOkVKxLHYzRLCXG9KTdPy8J0aTa55TIaWKTouwC\nxanMpy8Gih2mdNlZV57Q3RBDGN9RxJMzNhgwjM7EYpK4vp9dLcBXyZ6lWwHcnJA0\nrIPiWFMDAgMBAAECggEACXxCFfjF18sd/b/BKMoeO0/pLbB9EeBrJCV89sIGYFMF\nsVcifibVpNMMaIPzm7X76jXGzBfpyAUl3SIioZIgbBz9q+nWL7bB6bLtGHJ2WHw/\nT3w6Q5smvBd1FfrEsc5GNKQeDQnUzCPzAUzJ+8wORz92ZMW7z28tFJnJ7ypRg9Mn\nGUYGbmr4DobmhtLz5LjFomOOpPUMGaX/ucDC45wow169TkjS0UTdKAShYn7HJ2wZ\nSwAxZc1jECeDqVdioaY18bie03bQZSaiqoyfXkO3ulUYsuUYdlWCRKzAHd6NICEV\neyDkRdMOw2EVlXIUjpKoUmf0o30KDNSuVUTAWOWEcQKBgQD08dumHB9tAmxUSHaM\n5RjU8AYW1JeQ84pGvc5p8t6Y10pbKWGSp3rP6uHiH5G8n1J+XizBJ8iynJFCySrt\n6SfCyKUoXC2iUktcsWCuAT+IwnNgNsFN9nQAT6ai6yJgWOs1oAvbeKofU92z5cx1\n2Pzg8WubNEz/+7TIcf17wbFgFwKBgQDisUUaGm7yVT/YVuZtVvMGKpOA+tKP2Y1k\nEXQYi5al8oxiIpnvob8Gw49oSXjSMHx897SOYu6Jt0naaNeyHkQXUGC+l600MyMN\n302WmgBkhQrbcx0uio0ZwROy9dOSNH+KkyG3NKPtkcLGTVk9pSHJVNXKromr9hlX\nCgua09ir9QKBgA/VAil+b9mP6oiYFnGM7Un2Ka6YFyPbWfiwlALtG84tPDUgO5pL\nEPkXaXpAKB9U/PQGCkaB18sTq5/xeMDf7R398g7lxl1TjGN1Y5Zbpkukpeh2IZB0\neZL7kv28zQAFP068BYguCHD17sKN++UyHUY81IO3obJ6BnleRNAW+OwJAoGBAJo6\n2TTFPy6IaYOau/Mv8PAFD431GETeUp/+b+ozLi+BMZmiyPCMLxc+/daKBjWa31d2\nf9VP4dK4bPq30ehRRypFeUyyjRiyoerSPkt0Q0ggbB6Z1wTPJuiav/hF38fdB9kT\n+SBYJB+Bx+56uXiDXNVJbpsS3H+uU9cv8m1ILGXxAoGBAKSItllLR+l5n9mjaxrx\njT3nepmlNn2qXLPH+PThCKqdteCVz49Y/arHnGpwjpJ85rcbI6JbOHeNrqiMLPtz\nzF5lUUNB0BhpTR2zAaTajJ1x2tl6ZQAEb/Z97UU/R9obryyQ27lHCZbPw0tA1b+f\n//xi/WzuSuDAgoN+ilkh+AgD\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-gdqmz@ziv-ai.iam.gserviceaccount.com",
  "client_id": process.env.client_id,//"107439701548945039248",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gdqmz%40ziv-ai.iam.gserviceaccount.com"
};

module.exports = serviceAccount;