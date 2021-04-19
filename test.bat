start npm run server
for /l %%x in (1, 1, 4) do (
  timeout 1 >nul
  start npm run client
)
