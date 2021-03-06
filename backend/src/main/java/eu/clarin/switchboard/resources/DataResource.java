package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.core.MediaLibrary;
import eu.clarin.switchboard.core.xc.CommonException;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Path("storage")
public class DataResource {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(DataResource.class);

    MediaLibrary mediaLibrary;

    @Context
    HttpServletRequest request;

    public DataResource(MediaLibrary mediaLibrary)  {
        this.mediaLibrary = mediaLibrary;
    }

    @GET
    @Path("/{id}")
    public Response getFile(@PathParam("id") String idString)  {
        UUID id;
        try {
            id = UUID.fromString(idString);
        } catch (IllegalArgumentException xc) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        MediaLibrary.FileInfo fi = mediaLibrary.getFileInfo(id);
        if (fi == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        StreamingOutput fileStream = output -> {
            byte[] data = Files.readAllBytes(fi.getPath());
            output.write(data);
            output.flush();
        };
        return Response
                .ok(fileStream, fi.getMediatype())
                .header("content-disposition", "attachment; filename=" + fi.getFilename())
                .build();
    }


    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response postFile(@FormDataParam("file") InputStream inputStream,
                             @FormDataParam("file") final FormDataContentDisposition contentDispositionHeader,
                             @FormDataParam("link") String link) throws CommonException {
        MediaLibrary.FileInfo fileInfo;

        if (contentDispositionHeader != null) {
            String filename = contentDispositionHeader.getFileName();
            fileInfo = mediaLibrary.addMedia(filename, inputStream);
        } else if (link != null) {
            fileInfo = mediaLibrary.addMedia(link);
        } else {
            return Response.status(400).entity("Please provide either a file or a link to download in the form").build();
        }

        Map<String, Object> ret = new HashMap<>();
        ret.put("id", fileInfo.getId());
        ret.put("filename", fileInfo.getFilename());
        ret.put("fileLength", fileInfo.getFileLength());
        ret.put("mediatype", fileInfo.getMediatype());
        ret.put("language", fileInfo.getLanguage());
        ret.put("originalLink", fileInfo.getOriginalLink());
        ret.put("downloadLink", fileInfo.getDownloadLink());
        ret.put("httpRedirects", fileInfo.getHttpRedirects());

        URI localLink = UriBuilder.fromPath(request.getRequestURI())
                .path(fileInfo.getId().toString()).build();
        ret.put("localLink", localLink);

        LOGGER.debug("postFile return: " + ret);

        return Response.ok(ret).build();
    }
}
