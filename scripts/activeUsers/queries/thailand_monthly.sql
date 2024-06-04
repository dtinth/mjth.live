WITH monthly_rank AS (
  SELECT client_name, month, SUM(hours_seen) AS total_hours, RANK() OVER (PARTITION BY month ORDER BY SUM(hours_seen) DESC) AS rank
  FROM `dtinth-storage-space.jamulus_thailand.monthly_rollup` AS mr
  GROUP BY client_name, month
)
SELECT mr.* FROM `dtinth-storage-space.jamulus_thailand.monthly_rollup` AS mr
JOIN monthly_rank AS ranks ON ranks.client_name = mr.client_name AND ranks.month = mr.month
WHERE ranks.rank <= 50
ORDER BY month DESC, rank, server_name