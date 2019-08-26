DOCKERTAG=switchboard/switchboard:latest
WEBUIAPP=src/main/resources/webui
JSBUNDLE=$(WEBUIAPP)/bundle.js

build-docker-image:
	docker build -t $(DOCKERTAG) .

package: build-docker-image
	rm -rf build
	mkdir -p build/switchboard
	EXISTING_CONTAINER=$$(docker ps -aq --filter name=switchboard-build) ;\
	if [ ! -z "$${EXISTING_CONTAINER}" ]; then \
		docker rm "$${EXISTING_CONTAINER}" ;\
	fi
	# Spin the image so we can use "docker cp"
	docker run --name switchboard-build --entrypoint "true" $(DOCKERTAG) &&\
	docker cp switchboard-build:/switchboard build/
	(cd build && tar cvf switchboard.tar.gz switchboard)

build-webui-production:
	(cd webui && node_modules/webpack/bin/webpack.js --mode production -p)

run-backend:
	(cd backend && mvn -q package && JAVA_OPTS="-Xmx4g" target/appassembler/bin/switchboard server config.yaml)

run-webui-dev-server:
	(cd webui && node_modules/webpack-dev-server/bin/webpack-dev-server.js --mode development -d --hot)

dependencies:
	(cd webui && npm install)

clean:
	(cd backend && mvn -q clean)
	rm -rf webui/node_modules
	rm -f $(WEBUIAPP)/bundle.js*

.PHONY: build-docker-image build-webui-production run-backend run-webui-dev-server dependencies clean
