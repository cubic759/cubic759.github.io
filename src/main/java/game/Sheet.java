package game;

public class Sheet {
	String name, bpm, bars, beats, instruments[][];
	Sheet(){
		
	}
	public Sheet(String name, String bpm, String bars, String beats, String[][] instruments) {
		super();
		this.name = name;
		this.bpm = bpm;
		this.bars = bars;
		this.beats = beats;
		this.instruments = instruments;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBpm() {
		return bpm;
	}
	public void setBpm(String bpm) {
		this.bpm = bpm;
	}
	public String getBars() {
		return bars;
	}
	public void setBars(String bars) {
		this.bars = bars;
	}
	public String getBeats() {
		return beats;
	}
	public void setBeats(String beats) {
		this.beats = beats;
	}
	public String[][] getInstruments() {
		return instruments;
	}
	public void setInstruments(String[][] instruments) {
		this.instruments = instruments;
	}
	
}
