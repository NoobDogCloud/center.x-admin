echo "build image"
docker build --no-cache --progress=plain -t harbor.putao282.com:2443/library/gfw_master_frontend:latest .
echo "add tags"
docker tag harbor.putao282.com:2443/library/gfw_master_frontend:latest harbor.putao282.com:2443/library/gfw_master_frontend:latest
echo "publish image"
docker push harbor.putao282.com:2443/library/gfw_master_frontend:latest
