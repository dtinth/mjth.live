WITH yearly_rollup AS (
  SELECT client_name, server_name, SUM(hours_seen) AS hours_seen, SUBSTR(month, 1, 4) AS year
  FROM `dtinth-storage-space.jamulus_thailand.monthly_rollup` AS mr
  GROUP BY client_name, server_name, year
),
yearly_rank AS (
  SELECT client_name, year, SUM(hours_seen) AS total_hours, RANK() OVER (PARTITION BY year ORDER BY SUM(hours_seen) DESC) AS rank
  FROM yearly_rollup AS yr
  GROUP BY client_name, year
)
SELECT roll.* FROM yearly_rollup AS roll
JOIN yearly_rank AS ranks ON ranks.client_name = roll.client_name AND ranks.year = roll.year
WHERE total_hours >= 8
ORDER BY year DESC, total_hours DESC, server_name