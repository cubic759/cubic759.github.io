package game;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;




/**
 * Servlet implementation class GameFunction
 */
@WebServlet("/GameFunction")
public class GameFunction extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GameFunction() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String function=request.getParameter("function");
		File file;
		file = new File("MusicScore.txt");
		//file.delete();
		if(!file.exists()) {
			file.createNewFile();
		}
		if(function.equals("getScores")) {
			List<Sheet> list=new ArrayList<Sheet>();
			Scanner sc = new Scanner(file);
	        try {
	            String data = "";
	            while (sc.hasNextLine()) {
	            	data=sc.nextLine();
	            	if(!data.equals("")) {
		            	Sheet sheet = new Sheet();
	            		JSONObject json = JSONObject.parseObject(data);
		    	        sheet.setName(json.getString("name"));
		    	        sheet.setBpm(json.getString("bpm"));
		    	        String bars=json.getString("bars");
		    	        sheet.setBars(bars);
		    	        String beats=json.getString("beats");
		    	        sheet.setBeats(beats);
		    	        sheet.setInstruments(jsonToTwoArr(json.getString("instruments"),Integer.parseInt(bars)*Integer.parseInt(beats)));
		    	        list.add(sheet);
	            	}
	            }
	            sc.close();
	            String result=JSON.toJSONString(list);
				response.setContentType("text/html;charset=utf-8");
				response.getWriter().print(result);
	        } catch (IOException e) {
	            e.printStackTrace();
	        } catch(JSONException e) {
	        	
	        }
		}else if(function.equals("sendScore")) {
			String data=request.getParameter("data");
			FileWriter fw = new FileWriter(file, true);
			PrintWriter pw = new PrintWriter(fw);
			pw.println(data);
			pw.close();
			fw.close();
		}else if(function.equals("editScore")) {
			
		}else if(function.equals("deleteScore")) {
			File file2=new File("temp.txt");
			file2.delete();
			file2.createNewFile();
			String selectedData=request.getParameter("data");
			JSONObject json = JSONObject.parseObject(selectedData);
			String name=json.getString("name");
			Scanner sc = new Scanner(file);
			FileWriter fw = new FileWriter(file2, true);
			PrintWriter pw = new PrintWriter(fw);
			String data = "";
			while (sc.hasNextLine()) {
				data=sc.nextLine();
				if(!data.equals("")) {
					JSONObject json1 = JSONObject.parseObject(data);
					if(!name.equals(json1.getString("name"))) {
						pw.println(data);
					}
				}
			}
			pw.close();
			fw.close();
			sc.close();
			file.delete();
			file.createNewFile();
			Scanner sc1 = new Scanner(file2);
			FileWriter fw1 = new FileWriter(file, true);
			PrintWriter pw1 = new PrintWriter(fw1);
			while (sc1.hasNextLine()) {
				data=sc1.nextLine();
				if(!data.equals("")) {
					pw1.println(data);
				}
			}
			pw1.close();
			fw1.close();
			sc1.close();
			file2.delete();
		}else if(function.equals("checkName")) {
			boolean isOK=true;
			Scanner sc = new Scanner(file);
			String name=request.getParameter("data");
            String data = "";
            while (sc.hasNextLine()) {
            	data=sc.nextLine();
            	if(!data.equals("")) {
            		JSONObject json = JSONObject.parseObject(data);
	        		if(name.equals(json.getString("name"))) {
	    	        	isOK=false;
	    	        	break;
	    	        }
            	}
            }
            if(isOK) {
            	response.getWriter().write("Available");
            }else {
            	response.getWriter().write("Unavailable");
            }
            sc.close();
		}
	}
	public static String[][] jsonToTwoArr(String jsonStr, int length) {
        String[][] value = new String[4][length];
        JSONArray arr = JSONArray.parseArray(jsonStr);
        for (int i = 0; i < arr.size(); i++) {
            JSONArray jsonArray = (JSONArray) arr.get(i);
            for (int j = 0; j < jsonArray.size(); j++) {
                value[i][j] = String.valueOf(jsonArray.get(j));
            }
        }
        return value;
    }
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
}
