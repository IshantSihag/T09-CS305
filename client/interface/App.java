import java.swing.JFrame;

public class App {
    private JFrame frame;
    private int width;
    private int height;

    public App(int w, int h) {
        frame = new JFrame();
        width = w;
        height = h;
    }

    public void setUpGUI() {
        frame.setSize(width, height);
        frame.setTitle("GUI Demo");
        frame.setDefaultCloseOperation(javax.swing.JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }
}